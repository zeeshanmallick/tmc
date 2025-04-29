import { NextRequest, NextResponse } from "next/server";
import { getCloudflareContext } from "@/lib/cloudflare";
import { InvestorProfile } from "@/lib/db/schema";
import { authMiddleware } from "@/lib/auth-middleware";
import { searchInvestorInputSchema } from "@/lib/validations";

// GET handler to search for investors
async function searchInvestors(request: NextRequest, user: any) {
  try {
    // Extract and validate query parameters
    const { searchParams } = new URL(request.url);
    const rawParams = Object.fromEntries(searchParams.entries());

    const validationResult = searchInvestorInputSchema.safeParse(rawParams);
    if (!validationResult.success) {
      return NextResponse.json(
        {
          error: "Invalid search parameters",
          details: validationResult.error.errors,
        },
        { status: 400 }
      );
    }
    
    const { investorType, investmentStage, industry, location, minInvestment } =
      validationResult.data;

    // Build the SQL query with conditional filters
    let sql = "SELECT * FROM InvestorProfiles WHERE profile_complete = TRUE";
    const params: any[] = [];

    if (investorType && investorType !== "all") {
      sql += " AND investor_type = ?";
      params.push(investorType);
    }

    if (investmentStage && investmentStage !== "all") {
      // Assuming investmentStages is stored as comma-separated string or JSON array
      sql += " AND investment_stages LIKE ?";
      params.push(`%${investmentStage}%`);
    }

    if (industry && industry !== "all") {
      // Similar to investmentStages, assuming comma-separated or JSON
      sql += " AND interested_industries LIKE ?";
      params.push(`%${industry}%`);
    }

    if (location) {
      sql += " AND (location_city LIKE ? OR location_country LIKE ?)";
      params.push(`%${location}%`, `%${location}%`);
    }

    // Filtering by investment size range is complex with text ranges.
    if (minInvestment) {
      sql += " AND typical_investment_size = ?"; // Simplified match
      params.push(minInvestment);
    }

    // Add order by clause
    sql += " ORDER BY created_at DESC LIMIT 50";

    const { env } = getCloudflareContext();

    // Execute the query
    const stmt = env.DB.prepare(sql);
    const bindStmt = params.length > 0 ? stmt.bind(...params) : stmt;
    const investors = await bindStmt.all<InvestorProfile>();

    return NextResponse.json({ investors: investors.results }, { status: 200 });
  } catch (error) {
    console.error("Search investors error:", error);
    return NextResponse.json(
      { error: "Failed to search investors" },
      { status: 500 }
    );
  }
}

// Wrap handler with authMiddleware
export const GET = (req: NextRequest) => authMiddleware(req, searchInvestors);
