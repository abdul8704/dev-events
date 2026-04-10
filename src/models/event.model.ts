import mongoose, { Schema, model, models, Document } from 'mongoose';
import { normalizeTime, normalizeDate }  from "@/src/lib/helperFunctions"

// TypeScript interface for Event document
export interface IEvent extends Document {
    title: string;
    slug: string;
    description: string;
    overview: string;
    image: string;
    venue: string;
    location: string;
    date: string;
    time: string;
    mode: string;
    audience: string;
    agenda: string[];
    organizer: string;
    tags: string[];
    createdAt: Date;
    updatedAt: Date;
}

function normalizeLowercaseString(value: string) {
    return value.trim().toLowerCase();
}

const EventSchema = new Schema<IEvent>(
    {
        title: {
            type: String,
            required: [true, 'Title is required'],
            trim: true,
            maxlength: [100, 'Title cannot exceed 100 characters'],
        },
        slug: {
            type: String,
            unique: true,
            lowercase: true,
            trim: true,
        },
        description: {
            type: String,
            required: [true, 'Description is required'],
            trim: true,
            maxlength: [1000, 'Description cannot exceed 1000 characters'],
        },
        overview: {
            type: String,
            required: [true, 'Overview is required'],
            trim: true,
            maxlength: [500, 'Overview cannot exceed 500 characters'],
        },
        image: {
            type: String,
            required: [true, 'Image URL is required'],
            trim: true,
        },
        venue: {
            type: String,
            required: [true, 'Venue is required'],
            trim: true,
        },
        location: {
            type: String,
            required: [true, 'Location is required'],
            trim: true,
            lowercase: true,
            set: normalizeLowercaseString,
        },
        date: {
            type: String,
            required: [true, 'Date is required'],
        },
        time: {
            type: String,
            required: [true, 'Time is required'],
        },
        mode: {
            type: String,
            required: [true, 'Mode is required'],
            lowercase: true,
            trim: true,
            set: normalizeLowercaseString,
            enum: {
                values: ['online', 'offline', 'hybrid'],
                message: 'Mode must be either online, offline, or hybrid',
            },
        },
        audience: {
            type: String,
            required: [true, 'Audience is required'],
            trim: true,
        },
        agenda: {
            type: [String],
            required: [true, 'Agenda is required'],
            validate: {
                validator: (v: string[]) => v.length > 0,
                message: 'At least one agenda item is required',
            },
        },
        organizer: {
            type: String,
            required: [true, 'Organizer is required'],
            trim: true,
        },
        tags: {
            type: [String],
            required: [true, 'Tags are required'],
            validate: {
                validator: (v: string[]) => v.length > 0,
                message: 'At least one tag is required',
            },
        },
    },
    {
        timestamps: true, // Auto-generate createdAt and updatedAt
    }
);

// Pre-save hook for slug generation and data normalization
EventSchema.pre('save', async  function () {
    const event = this as IEvent;

    // Generate slug only if title changed or document is new
    if (event.isModified('title') || event.isNew) {
        const EventModel = event.constructor as mongoose.Model<IEvent>;
        const baseSlug = generateSlug(event.title);
        let candidateSlug = baseSlug;
        let suffix = 1;

        while (
            await EventModel.findOne({
                slug: candidateSlug,
                _id: { $ne: event._id },
            })
        ) {
            candidateSlug = `${baseSlug}-${suffix}`;
            suffix += 1;
        }

        event.slug = candidateSlug;
    }

    // Normalize date to ISO format if it's not already
    if (event.isModified('date')) {
        event.date = normalizeDate(event.date);
    }

    // Normalize time format (HH:MM)
    if (event.isModified('time')) {
        event.time = normalizeTime(event.time);
    }
});

/**
 * Create a URL-friendly slug from a text title.
 *
 * @param title - The input string to convert into a slug
 * @returns The slugified version of `title`: lowercase, spaces replaced by single hyphens, characters other than letters a–z and digits 0–9 removed, consecutive hyphens collapsed, and no leading or trailing hyphens
 */
function generateSlug(title: string): string {
    return title
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9\s-]/g, '') // Remove special characters
        .replace(/\s+/g, '-') // Replace spaces with hyphens
        .replace(/-+/g, '-') // Replace multiple hyphens with single hyphen
        .replace(/^-|-$/g, ''); // Remove leading/trailing hyphens
}



// Create unique index on slug for better performance
EventSchema.index({ slug: 1 }, { unique: true });

// Create compound index for common queries
EventSchema.index({ date: 1, mode: 1 });

const Event = models.Event || model<IEvent>('Event', EventSchema);

export default Event;

