import mongoose, { Schema, model, models, Document, Types } from 'mongoose';
import Event from './event.model';

// TypeScript interface for Booking document
export interface IBooking extends Document {
    eventId: Types.ObjectId;
    email: string;
    createdAt: Date;
    updatedAt: Date;
}

const BookingSchema = new Schema<IBooking>(
    {
        eventId: {
            type: Schema.Types.ObjectId,
            ref: 'Event',
            required: [true, 'Event ID is required'],
        },
        email: {
            type: String,
            required: [true, 'Email is required'],
            trim: true,
            lowercase: true,
            validate: {
                validator: function (email: string) {
                    // RFC 5322 compliant email validation regex
                    const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
                    return emailRegex.test(email);
                },
                message: 'Please provide a valid email address',
            },
        },
    },
    {
        timestamps: true, // Auto-generate createdAt and updatedAt
    }
);

function createValidationError(path: string, message: string, value?: unknown): mongoose.Error.ValidationError {
    const validationError = new mongoose.Error.ValidationError();
    validationError.addError(
        path,
        new mongoose.Error.ValidatorError({
            path,
            message,
            value,
        })
    );
    return validationError;
}

// Pre-save hook to validate events exists before creating booking
BookingSchema.pre('save', async function () {
    const booking = this as IBooking;

    // Only validate eventId if it's new or modified
    if (booking.isModified('eventId') || booking.isNew) {
        try {
            if (!mongoose.isValidObjectId(booking.eventId)) {
                throw createValidationError('eventId', 'Invalid event ID format', booking.eventId);
            }

            // Use an existence check rather than hydrating a document we do not need
            const eventExists = await Event.exists({ _id: booking.eventId });

            if (!eventExists) {
                throw createValidationError(
                    'eventId',
                    `Event with ID ${booking.eventId} does not exist`,
                    booking.eventId
                );
            }
        } catch (err: any) {
            if (err.name === 'CastError') {
                throw createValidationError('eventId', 'Invalid event ID format', booking.eventId);
            }

            // Re-throw ValidationError as-is
            if (err.name === 'ValidationError') {
                throw err;
            }

            // Re-throw all other errors (DB connection, operational errors) unchanged
            throw err;
        }
    }
    // 4. No need to call next() at the end!
    // The async function will naturally resolve and Mongoose will proceed.
});

BookingSchema.post('save', function (error: any, _doc: IBooking, next: (err?: Error) => void) {
    if (error?.name === 'MongoServerError' && error.code === 11000) {
        next(createValidationError('email', 'A booking for this event and email already exists'));
        return;
    }

    next(error);
});

// Create index on eventId for faster queries
BookingSchema.index({ eventId: 1 });

// Create compound index for common queries (events bookings by date)
BookingSchema.index({ eventId: 1, createdAt: -1 });

// Create index on email for user booking lookups
BookingSchema.index({ email: 1 });

// Enforce one booking per events per email
BookingSchema.index({ eventId: 1, email: 1 }, { unique: true, name: 'uniq_event_email' });
const Booking = models.Booking || model<IBooking>('Booking', BookingSchema);

export default Booking;
