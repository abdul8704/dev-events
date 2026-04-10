import { NextRequest, NextResponse } from "next/server";
import EventService from "@/src/services/events.service"
import connectDB from "@/src/lib/db";

export async function GET() {
    try{
        await connectDB();
        const data = await EventService.getAllEvents();

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



export async function POST(req: NextRequest): Promise<NextResponse> {
    try{
        await connectDB();
        const form = await req.formData();

        await EventService.createEvent(form);
        return NextResponse.json({
            status: 201,
            success: true,
            message: "Event created",
        })
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