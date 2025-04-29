import { NextRequest, NextResponse } from "next/server";
import { getCloudflareContext } from "@/lib/cloudflare";
import { CompanyProfile } from "@/lib/db/schema";
import { authMiddleware } from "@/lib/auth-middleware";
import { searchCompanyInputSchema } from "@/lib/validations";

// GET handler to search for companies
async function searchCompanies(request: NextRequest, user: any) {
  try {
    // Extract and validate query parameters
    const { searchParams } = new URL(request.url);
    const rawParams = Object.fromEntries(searchParams.entries());

    // Convert numeric params
    if (rawParams.minFunding) rawParams.minFunding = Number(rawParams.minFunding);
    if (rawParams.maxFunding) rawParams.maxFunding = Number(rawParams.maxFunding);

    const validationResult = searchCompanyInputSchema.safeParse(rawParams);
    if (!validationResult.success) {
      return NextResponse.json(
        {
          error: "Invalid search parameters",
          details: validationResult.error.errors,
        },
        { status: 400 }
      );
    }
    const { industry, fundingType, location, minFunding, maxFunding } =
      validationResult.data;

    // Build the SQL query with conditional filters
    let sql = "SELECT * FROM CompanyProfiles WHERE profile_complete = TRUE";
    const params: any[] = [];

    if (industry && industry !== "all") {
      sql += " AND industry = ?";
      params.push(industry);
    }

    if (fundingType && fundingType !== "all") {
      sql += " AND funding_type = ?";
      params.push(fundingType);
    }

    if (location) {
      sql += " AND location LIKE ?";
      params.push(`%${location}%`);
    }

    if (minFunding) {
      sql += " AND funding_amount_sought >= ?";
      params.push(minFunding);
    }

    if (maxFunding) {
      sql += " AND funding_amount_sought <= ?";
      params.push(maxFunding);
    }

    // Add order by clause
    sql += " ORDER BY created_at DESC LIMIT 50";

    const { env } = getCloudflareContext();

    // Execute the query
    const stmt = env.DB.prepare(sql);
    const bindStmt = params.length > 0 ? stmt.bind(...params) : stmt;
    const companies = await bindStmt.all<CompanyProfile>();

    return NextResponse.json({ companies: companies.results }, { status: 200 });
  } catch (error) {
    console.error("Search companies error:", error);
    return NextResponse.json(
      { error: "Failed to search companies" },
      { status: 500 }
    );
  }
}

// Wrap handler with authMiddleware
export const GET = (req: NextRequest) => authMiddleware(req, searchCompanies);

