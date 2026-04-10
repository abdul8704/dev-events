import Event from "@/src/models/event.model";
import ServiceResponse from "@/src/types/index";
import { v2 as cloudinary } from 'cloudinary';

const getAllEvents = async (): Promise<ServiceResponse> => {
    try{
        const data = await Event.find();
console.log(data);
        return {
            success: true,
            message: "All events retrieved",
            data: data
        }
    }
    catch(err){
        console.log(err);
        throw err;
    }
}

const getEventBySlug = async (slug: string): Promise<ServiceResponse> => {
    try{
        const data = await Event.findOne({ slug });

        return {
            success: true,
            message: "Event retrieved successfully",
            data: data
        }
    }
    catch(err){
        console.log(err);
        throw err;
    }
}

const createEvent = async (formData: FormData): Promise<ServiceResponse> => {
    try{
        const file = formData.get('image') as File;
        const agenda = formData
            .getAll('agenda')
            .map((item) => item.toString().trim())
            .filter(Boolean);
        const tags = formData
            .getAll('tags')
            .map((item) => item.toString().trim().toLowerCase())
            .filter(Boolean);

        if(!(file instanceof File))
            throw new Error("No file uploaded");

        const event: {
            title?: string;
            description?: string;
            overview?: string;
            venue?: string;
            location?: string;
            date?: string;
            time?: string;
            mode?: string;
            audience?: string;
            organizer?: string;
            agenda: string[];
            tags: string[];
            image?: string;
        } = {
            title: formData.get('title')?.toString().trim(),
            description: formData.get('description')?.toString().trim(),
            overview: formData.get('overview')?.toString().trim(),
            venue: formData.get('venue')?.toString().trim(),
            location: formData.get('location')?.toString().trim(),
            date: formData.get('date')?.toString().trim(),
            time: formData.get('time')?.toString().trim(),
            mode: formData.get('mode')?.toString().trim(),
            audience: formData.get('audience')?.toString().trim(),
            organizer: formData.get('organizer')?.toString().trim(),
            agenda,
            tags,
        };

        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        const uploadResult = await new Promise((resolve, reject) => {
            cloudinary.uploader.upload_stream({ resource_type: "image" , folder: 'DevEvent'}, (error, result) => {
                if (error)
                    reject(error);

                resolve(result);
            }).end(buffer)
        })

        event.image = (uploadResult as { secure_url: string }).secure_url;

        const createdEvent = await Event.create(event);

        return {
            success: true,
            message: "Event created successfully",
            data: {
                id: createdEvent._id,
                slug: createdEvent.slug,
            },
        }
    }
    catch(err){
        console.log(err);
        throw err;
    }
}
const updateEvent = async (id: string, formData: FormData): Promise<ServiceResponse> => {
    try {
        const data = Event.findByIdAndUpdate(id, formData);

        return {
            success: true,
            message: "Updated Successfully",
            data: data
        }
    }
    catch(err){
        console.log(err);
        throw err;
    }
}

const deleteEvent = async (id: string): Promise<ServiceResponse> => {
    try{
        const data = await Event.findByIdAndDelete(id);

        return {
            success: true,
            message: "Deleted Successfully",
            data: data
        }
    }
    catch(err){
        console.log(err);
        throw err;
    }
}

const eventService = {
    getAllEvents,
    getEventBySlug,
    updateEvent,
    createEvent,
    deleteEvent,
};

export default eventService;
