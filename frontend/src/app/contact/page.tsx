"use client";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<{
    success?: boolean;
    message?: string;
  }>({});

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // ...existing code...
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch(
        `${
          process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"
        }/users/contact/`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        }
      );
      const data = await response.json();
      setSubmitStatus({
        success: response.ok,
        message: data.message || "Message sent successfully!",
      });
      if (response.ok)
        setFormData({ name: "", email: "", subject: "", message: "" });
    } catch {
      setSubmitStatus({
        success: false,
        message: "There was an error sending your message. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  // ...existing code...

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Hero section */}
      <section className="relative h-[300px] mb-16 rounded-2xl overflow-hidden bg-primary-dark">
        <div className="absolute inset-0">
          <Image
            src="/images/contact-hero.jpg"
            alt="Contact us"
            fill
            style={{ objectFit: "cover" }}
            className="opacity-60 hover:scale-105 transition-transform duration-700 ease-in-out"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-primary-dark/80 via-primary/60 to-primary-dark/50"></div>
        </div>
        <div className="relative h-full flex items-center">
          <div className="container mx-auto px-6">
            <div className="max-w-3xl p-8 rounded-xl">
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 leading-tight tracking-tight drop-shadow-lg">
                Get In Touch
              </h1>
              <p className="text-white text-lg md:text-xl leading-relaxed drop-shadow">
                Have questions? Want to contribute? We&apos;d love to hear from
                you.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Contact content */}
      <div className="flex flex-col lg:flex-row gap-12 mb-20">
        {/* Contact info */}
        <div className="lg:w-1/3">
          <div className="bg-white p-8 rounded-xl shadow-card hover:shadow-card-hover transition-all duration-300">
            <h2 className="text-2xl font-bold text-primary-dark mb-6">
              Contact Information
            </h2>
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 flex items-center justify-center bg-primary/10 rounded-full text-primary">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    />
                  </svg>
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">Email</h3>
                  <a
                    href="mailto:jayabratabasu@gmail.com"
                    className="text-primary hover:text-primary-dark transition-colors"
                  >
                    jayabratabasu@gmail.com
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 flex items-center justify-center bg-primary/10 rounded-full text-primary">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">Location</h3>
                  <p className="text-gray-600">
                    Schulich School of Business, York University
                    <br />
                    Toronto, Ontario, Canada
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 flex items-center justify-center bg-primary/10 rounded-full text-primary">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                    />
                  </svg>
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">Social Media</h3>
                  <div className="flex gap-3 mt-2">
                    <a
                      href="#"
                      className="text-gray-600 hover:text-primary transition-colors"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M22.675 0h-21.35c-.732 0-1.325.593-1.325 1.325v21.351c0 .731.593 1.324 1.325 1.324h11.495v-9.294h-3.128v-3.622h3.128v-2.671c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.795.143v3.24l-1.918.001c-1.504 0-1.795.715-1.795 1.763v2.313h3.587l-.467 3.622h-3.12v9.293h6.116c.73 0 1.323-.593 1.323-1.325v-21.35c0-.732-.593-1.325-1.325-1.325z" />
                      </svg>
                    </a>
                    <a
                      href="#"
                      className="text-gray-600 hover:text-primary transition-colors"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z" />
                      </svg>
                    </a>
                    <a
                      href="#"
                      className="text-gray-600 hover:text-primary transition-colors"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                      </svg>
                    </a>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-10 p-6 bg-primary/5 rounded-lg">
              <h3 className="font-bold text-lg text-primary-dark mb-2">
                Research Collaboration
              </h3>
              <p className="text-gray-600 mb-4">
                Interested in collaborating on sustainable agriculture research?
                We&apos;re always open to new partnerships.
              </p>
              <Link
                href="/research"
                className="text-primary hover:text-primary-dark font-medium transition-colors flex items-center"
              >
                View our research
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 ml-1"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </Link>
            </div>
          </div>
        </div>

        {/* Contact form */}
        <div className="lg:w-2/3">
          <div className="bg-white p-8 rounded-xl shadow-card hover:shadow-card-hover transition-all duration-300">
            <h2 className="text-2xl font-bold text-primary-dark mb-6">
              Send Us a Message
            </h2>
            {submitStatus.message && (
              <div
                className={`mb-6 p-4 rounded-lg ${
                  submitStatus.success
                    ? "bg-green-50 text-green-700 border border-green-100"
                    : "bg-red-50 text-red-700 border border-red-100"
                }`}
              >
                {submitStatus.message}
              </div>
            )}
            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Your Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary focus:border-primary"
                  />
                </div>
                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Your Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary focus:border-primary"
                  />
                </div>
              </div>
              <div className="mb-6">
                <label
                  htmlFor="subject"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Subject
                </label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary focus:border-primary"
                />
              </div>
              <div className="mb-6">
                <label
                  htmlFor="message"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows={5}
                  value={formData.message}
                  onChange={handleChange}
                  required
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary focus:border-primary"
                ></textarea>
              </div>
              <div>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`w-full md:w-auto flex justify-center items-center px-8 py-3 border border-transparent rounded-lg shadow-sm text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-colors ${
                    isSubmitting ? "opacity-75 cursor-wait" : ""
                  }`}
                >
                  {isSubmitting ? (
                    <>
                      <svg
                        className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Sending...
                    </>
                  ) : (
                    "Send Message"
                  )}
                </button>
              </div>
            </form>
          </div>

          {/* FAQ Section */}
          <div className="mt-10">
            <h3 className="text-xl font-bold text-primary-dark mb-4">
              Frequently Asked Questions
            </h3>
            <div className="space-y-4">
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <h4 className="font-medium text-gray-900 mb-2">
                  How can I contribute to the research repository?
                </h4>
                <p className="text-gray-600">
                  You can submit your research papers or articles through our
                  contact form. Our team will review your submission and get
                  back to you.
                </p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <h4 className="font-medium text-gray-900 mb-2">
                  Are you open to research partnerships?
                </h4>
                <p className="text-gray-600">
                  Yes, we welcome research partnerships with universities, NGOs,
                  and other organizations focused on sustainable agriculture.
                </p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <h4 className="font-medium text-gray-900 mb-2">
                  How often is new research added to the repository?
                </h4>
                <p className="text-gray-600">
                  We update our repository regularly as new research becomes
                  available. Check back frequently or subscribe to our
                  newsletter for updates.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
