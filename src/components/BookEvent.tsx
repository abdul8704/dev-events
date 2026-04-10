'use client';

import { useState } from "react";
import { createBooking } from "@/src/lib/actions/booking.actions";
import posthog from "posthog-js";

const BookEvent = ({ eventId, slug }: { eventId: string, slug: string;}) => {
    const [email, setEmail] = useState('');
    const [submitted, setSubmitted] = useState(false);
    const [status, setStatus] = useState<{ type: 'already-booked' | 'error'; message: string } | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setStatus(null);

        const response = await createBooking({ eventId, slug, email });

        if (response.success) {
            setSubmitted(true);
            posthog.capture('event_booked', { eventId, slug, email })
        } else if (response.message === 'Already booked') {
            setStatus({
                type: 'already-booked',
                message: 'You have already registered for this event with this email address.',
            });
        } else {
            setStatus({
                type: 'error',
                message: response.message,
            });
            console.error(response.message)
            posthog.captureException(new Error(response.message))
        }
    }

    return (
        <div id="book-event">
            {submitted ? (
                <p className="text-sm">Thank you for signing up!</p>
            ) : status?.type === 'already-booked' ? (
                <div className="booking-notice booking-notice-registered">
                    <p className="booking-notice-title">Already registered</p>
                    <p className="text-sm">{status.message}</p>
                </div>
            ): (
                <form onSubmit={handleSubmit}>
                    <div>
                        <label htmlFor="email">Email Address</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            id="email"
                            placeholder="Enter your email address"
                        />
                    </div>

                    <button type="submit" className="button-submit">Submit</button>
                    {status?.type === 'error' ? (
                        <div className="booking-notice booking-notice-error">
                            <p className="booking-notice-title">Something went wrong</p>
                            <p className="text-sm">{status.message}</p>
                        </div>
                    ) : null}
                </form>
            )}
        </div>
    )
}
export default BookEvent
