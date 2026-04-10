import connectDB from "@/src/lib/db";
import Events from "@/src/models/event.model"

export const getSimilarEventsBySlug = async (slug: string) => {
    try{
        await connectDB();

        const event = await Events.findOne({ slug });

        return await Events.find(
            { _id: { $ne: event._id },
             tags: {$in: event.tags}}
        );
    }
    catch(err){
        console.log(err);
        return[];
    }
}
