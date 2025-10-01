// src/components/FAQSection.jsx
import React from "react";

export default function FAQSection() {
  return (
    <section className="max-w-5xl mx-auto p-6">
      <h2 className="text-3xl font-bold text-center mb-8">
        Frequently Asked Questions
      </h2>

      <div className="space-y-4">
        {/* FAQ Item 1 */}
        <div className="collapse collapse-plus bg-base-100 border border-base-300">
          <input type="radio" name="faq-accordion" defaultChecked />
          <div className="collapse-title font-semibold">
            Who can apply for scholarships?
          </div>
          <div className="collapse-content text-sm">
            Most scholarships are open to students with strong academic records.
            Some are specific to certain fields of study or nationalities. Always
            check the eligibility criteria before applying.
          </div>
        </div>

        {/* FAQ Item 2 */}
        <div className="collapse collapse-plus bg-base-100 border border-base-300">
          <input type="radio" name="faq-accordion" />
          <div className="collapse-title font-semibold">
            Do I need IELTS/TOEFL to apply?
          </div>
          <div className="collapse-content text-sm">
            Many international scholarships require proof of English proficiency
            through exams like IELTS or TOEFL. However, some universities may
            waive this if you studied in English previously.
          </div>
        </div>

        {/* FAQ Item 3 */}
        <div className="collapse collapse-plus bg-base-100 border border-base-300">
          <input type="radio" name="faq-accordion" />
          <div className="collapse-title font-semibold">
            Can I apply for multiple scholarships at the same time?
          </div>
          <div className="collapse-content text-sm">
            Yes, you can apply to multiple scholarships simultaneously, as long
            as you meet the eligibility requirements. Make sure to keep track of
            deadlines and required documents.
          </div>
        </div>

        {/* FAQ Item 4 */}
        <div className="collapse collapse-plus bg-base-100 border border-base-300">
          <input type="radio" name="faq-accordion" />
          <div className="collapse-title font-semibold">
            What documents are usually required for application?
          </div>
          <div className="collapse-content text-sm">
            Common documents include transcripts, CV/resume, statement of
            purpose, recommendation letters, and proof of language proficiency.
            Some scholarships may also request financial documents.
          </div>
        </div>

        {/* FAQ Item 5 */}
        <div className="collapse collapse-plus bg-base-100 border border-base-300">
          <input type="radio" name="faq-accordion" />
          <div className="collapse-title font-semibold">
            How long does it take to get scholarship results?
          </div>
          <div className="collapse-content text-sm">
            It varies by program. Some scholarships announce results within 1–2
            months after the deadline, while others may take up to 6 months. You
            will usually be notified by email.
          </div>
        </div>

        {/* FAQ Item 6 */}
        <div className="collapse collapse-plus bg-base-100 border border-base-300">
          <input type="radio" name="faq-accordion" />
          <div className="collapse-title font-semibold">
            What should I do if I am not selected?
          </div>
          <div className="collapse-content text-sm">
            Don’t be discouraged! Many students apply for multiple scholarships
            before securing one. Use the feedback to strengthen your next
            application and try again.
          </div>
        </div>
      </div>
    </section>
  );
}
