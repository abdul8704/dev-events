'use client';

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

type FormStatus = {
    type: 'success' | 'error';
    message: string;
} | null;

const initialState = {
    title: '',
    description: '',
    overview: '',
    venue: '',
    location: '',
    date: '',
    time: '',
    mode: 'offline',
    audience: '',
    organizer: '',
    agenda: '',
    tags: '',
};

const CreateEventForm = () => {
    const router = useRouter();
    const [isPending, startTransition] = useTransition();
    const [status, setStatus] = useState<FormStatus>(null);
    const [formState, setFormState] = useState(initialState);
    const [imageFile, setImageFile] = useState<File | null>(null);

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
    ) => {
        const { name, value } = e.target;

        setFormState((current) => ({
            ...current,
            [name]: value,
        }));
    };

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setStatus(null);

        if (!imageFile) {
            setStatus({
                type: 'error',
                message: 'Please upload an event banner image.',
            });
            return;
        }

        const agendaItems = formState.agenda
            .split('\n')
            .map((item) => item.trim())
            .filter(Boolean);
        const tagItems = formState.tags
            .split(',')
            .map((item) => item.trim())
            .filter(Boolean);

        if (agendaItems.length === 0 || tagItems.length === 0) {
            setStatus({
                type: 'error',
                message: 'Add at least one agenda item and one tag.',
            });
            return;
        }

        const payload = new FormData();
        payload.append('title', formState.title);
        payload.append('description', formState.description);
        payload.append('overview', formState.overview);
        payload.append('venue', formState.venue);
        payload.append('location', formState.location);
        payload.append('date', formState.date);
        payload.append('time', formState.time);
        payload.append('mode', formState.mode);
        payload.append('audience', formState.audience);
        payload.append('organizer', formState.organizer);
        payload.append('image', imageFile);

        agendaItems.forEach((item) => payload.append('agenda', item));
        tagItems.forEach((item) => payload.append('tags', item));

        startTransition(async () => {
            try {
                const response = await fetch('/api/events', {
                    method: 'POST',
                    body: payload,
                });
                const result = await response.json();

                if (!response.ok || !result.success) {
                    throw new Error(result.message || 'Failed to create event');
                }

                setStatus({
                    type: 'success',
                    message: 'Event created. Redirecting to the event page...',
                });
                setFormState(initialState);
                setImageFile(null);

                const slug = result.data?.slug;

                if (slug) {
                    router.push(`/events/${slug}`);
                    return;
                }

                router.refresh();
            } catch (error) {
                setStatus({
                    type: 'error',
                    message: error instanceof Error ? error.message : 'Failed to create event',
                });
            }
        });
    };

    return (
        <div id="create-event-page">
            <section className="create-event-hero">
                <div className="hero-copy">
                    <p className="eyebrow">Create Event</p>
                    <h1>Launch a developer event that feels worth attending.</h1>
                    <p className="hero-text">
                        Fill in the event details, upload a banner, and publish directly into the
                        DevEvents listing.
                    </p>
                </div>
                <div className="hero-panel">
                    <p className="panel-label">Checklist</p>
                    <ul className="hero-points">
                        <li>Upload one banner image</li>
                        <li>Use one agenda item per line</li>
                        <li>Separate tags with commas</li>
                    </ul>
                </div>
            </section>

            <section className="create-event-layout">
                <div className="create-event-card">
                    <div className="create-event-card-head">
                        <h2>Event Details</h2>
                        <p className="text-sm">All fields map directly to the event schema.</p>
                    </div>

                    <form className="create-event-form" onSubmit={handleSubmit}>
                        <div className="field-grid field-grid-double">
                            <label className="field">
                                <span>Event title</span>
                                <input name="title" value={formState.title} onChange={handleChange} required />
                            </label>
                            <label className="field">
                                <span>Organizer</span>
                                <input name="organizer" value={formState.organizer} onChange={handleChange} required />
                            </label>
                        </div>

                        <label className="field">
                            <span>Description</span>
                            <textarea
                                name="description"
                                value={formState.description}
                                onChange={handleChange}
                                rows={3}
                                required
                            />
                        </label>

                        <label className="field">
                            <span>Overview</span>
                            <textarea
                                name="overview"
                                value={formState.overview}
                                onChange={handleChange}
                                rows={3}
                                required
                            />
                        </label>

                        <div className="field-grid field-grid-double">
                            <label className="field">
                                <span>Venue</span>
                                <input name="venue" value={formState.venue} onChange={handleChange} required />
                            </label>
                            <label className="field">
                                <span>Location</span>
                                <input name="location" value={formState.location} onChange={handleChange} required />
                            </label>
                        </div>

                        <div className="field-grid field-grid-triple">
                            <label className="field">
                                <span>Date</span>
                                <input type="date" name="date" value={formState.date} onChange={handleChange} required />
                            </label>
                            <label className="field">
                                <span>Time</span>
                                <input type="time" name="time" value={formState.time} onChange={handleChange} required />
                            </label>
                            <label className="field">
                                <span>Mode</span>
                                <select name="mode" value={formState.mode} onChange={handleChange} required>
                                    <option value="offline">Offline</option>
                                    <option value="online">Online</option>
                                    <option value="hybrid">Hybrid</option>
                                </select>
                            </label>
                        </div>

                        <label className="field">
                            <span>Audience</span>
                            <input name="audience" value={formState.audience} onChange={handleChange} required />
                        </label>

                        <label className="field">
                            <span>Agenda</span>
                            <textarea
                                name="agenda"
                                value={formState.agenda}
                                onChange={handleChange}
                                rows={5}
                                placeholder={"Opening note\nKeynote session\nPanel discussion"}
                                required
                            />
                        </label>

                        <label className="field">
                            <span>Tags</span>
                            <input
                                name="tags"
                                value={formState.tags}
                                onChange={handleChange}
                                placeholder="react, nextjs, frontend"
                                required
                            />
                        </label>

                        <label className="field">
                            <span>Banner image</span>
                            <input
                                type="file"
                                accept="image/*"
                                onChange={(e) => setImageFile(e.target.files?.[0] ?? null)}
                                required
                            />
                        </label>

                        {status ? (
                            <div
                                className={`booking-notice ${
                                    status.type === 'success'
                                        ? 'booking-notice-registered'
                                        : 'booking-notice-error'
                                }`}
                            >
                                <p className="booking-notice-title">
                                    {status.type === 'success' ? 'Event created' : 'Submission failed'}
                                </p>
                                <p className="text-sm">{status.message}</p>
                            </div>
                        ) : null}

                        <button type="submit" className="button-submit" disabled={isPending}>
                            {isPending ? 'Creating event...' : 'Create event'}
                        </button>
                    </form>
                </div>

                <aside className="create-event-aside">
                    <div className="signup-card">
                        <h2>Before You Publish</h2>
                        <p className="text-sm">
                            The API generates the slug from the title, normalizes date and time, and
                            uploads the banner to Cloudinary.
                        </p>
                        <div className="aside-list">
                            <p>Use a clear title that describes the event format.</p>
                            <p>Pick tags that help similar-event recommendations work.</p>
                            <p>Prefer short, scannable agenda items over paragraphs.</p>
                        </div>
                    </div>
                </aside>
            </section>
        </div>
    );
};

export default CreateEventForm;
