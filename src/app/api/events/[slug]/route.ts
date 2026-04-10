import { NextRequest, NextResponse } from "next/server";
import EventService from "@/src/services/events.service"
import connectDB from "@/src/lib/db";

interface RouteParams {
    params: Promise<{
        slug: string;
    }>
}

export async function GET(req: NextRequest, { params }: RouteParams ): Promise<NextResponse> {
    try{
        await connectDB();
        const { slug } = await params;

        if (!slug || slug.trim() === '') {
            return NextResponse.json({
              status: 400,
              message: "Missing Slug",
            })
        }

        const sanitizedSlug = slug.trim().toLowerCase();
        const data = await EventService.getEventBySlug(sanitizedSlug);

        if(!data){
            return NextResponse.json({
                status: 404,
                message: "Event not found",
            })
        }

        return NextResponse.json({
            status: 200,
            ... data
        });
    }
    catch(err){
        console.log(err);
        return NextResponse.json({
            status: 500,
            success: false,
            message: err
        })
    }
}