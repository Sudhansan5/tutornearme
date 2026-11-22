import gradio as gr

# In-memory "database" for demo purposes
# Will be replaced by real backend later
tutors = []

def register_tutor(name, subject, location, rating, availability):
    """Register a new tutor."""
    tutor = {
        "name": name,
        "subject": subject,
        "location": location,
        "rating": float(rating) if rating else 0.0,
        "availability": availability
    }
    tutors.append(tutor)
    return f"✅ Tutor {name} registered successfully!"

def search_tutors(location, subject_filter=""):
    """Search tutors by location (and optional subject)."""
    results = [t for t in tutors if location.lower() in t["location"].lower()]
    if subject_filter:
        results = [t for t in results if subject_filter.lower() in t["subject"].lower()]

    if not results:
        return "No tutors found matching your criteria."

    # Format results
    lines = []
    for t in results:
        lines.append(f"**{t['name']}**")
        lines.append(f"• Subject: {t['subject']}")
        lines.append(f"• Location: {t['location']}")
        lines.append(f"• Rating: {t['rating']}/5.0")
        lines.append(f"• Availability: {t['availability']}")
        lines.append("-" * 30)

    return "\n".join(lines)

with gr.Blocks(title="TutorNearMe Demo", theme=gr.themes.Soft()) as app:
    gr.Markdown("# �utorNearMe - Tutor Search & Registration")
    gr.Markdown("Demo platform connecting students with local tutors")

    with gr.Tabs():
        # --- Registration Tab ---
        with gr.TabItem("📝 Register as Tutor"):
            gr.Markdown("### Register yourself as a tutor")

            with gr.Row():
                tutor_name = gr.Textbox(label="Full Name", placeholder="e.g., Jane Smith")
                tutor_subject = gr.Dropdown(
                    choices=["Math", "Physics", "Chemistry", "Biology", "English", "Programming", "Other"],
                    label="Subject",
                    value="Math"
                )

            with gr.Row():
                tutor_location = gr.Textbox(label="Location (City/Area)", placeholder="e.g., San Francisco, CA")
                tutor_rating = gr.Slider(minimum=0, maximum=5, step=0.1, label="Rating (out of 5)", value=4.5)

            tutor_availability = gr.Dropdown(
                choices=["Weekdays", "Weekends", "Flexible", "Online Only"],
                label="Availability",
                value="Flexible"
            )

            register_btn = gr.Button("Register Tutor", variant="primary")
            register_output = gr.Textbox(label="Status", interactive=False)

            register_btn.click(
                fn=register_tutor,
                inputs=[tutor_name, tutor_subject, tutor_location, tutor_rating, tutor_availability],
                outputs=register_output
            )

        # --- Search Tab ---
        with gr.TabItem("🔍 Search Tutors"):
            gr.Markdown("### Find tutors near you")

            with gr.Row():
                search_location = gr.Textbox(label="Location", placeholder="e.g., New York, NY")
                search_subject = gr.Dropdown(
                    choices=["All"] + ["Math", "Physics", "Chemistry", "Biology", "English", "Programming"],
                    label="Subject (optional)",
                    value="All"
                )

            search_btn = gr.Button("Search Tutors", variant="primary")
            search_output = gr.Markdown(label="Results")

            search_btn.click(
                fn=search_tutors,
                inputs=[search_location, search_subject],
                outputs=search_output
            )

    # Footer
    gr.Markdown("---")
    gr.Markdown("*This is a demo frontend. Backend integration coming next phase.*")

if __name__ == "__main__":
    app.launch(
        server_name="0.0.0.0",
        server_port=7860,
        share=True,
        debug=True
    )