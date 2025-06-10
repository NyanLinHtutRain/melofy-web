"use client"; // Required for using React Hooks and event handlers

import { useState, FormEvent } from "react";
import NewsLatterBox from "./NewsLatterBox";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [statusMessage, setStatusMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isError, setIsError] = useState(false); // To style the status message

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault(); // Prevent default browser submission
    setIsSubmitting(true);
    setStatusMessage(""); // Clear previous messages
    setIsError(false);

    // Basic client-side validation
    if (!formData.name.trim() || !formData.email.trim() || !formData.message.trim()) {
      setStatusMessage("All fields are required.");
      setIsError(true);
      setIsSubmitting(false);
      return;
    }
    // Simple email format check
    if (!formData.email.includes('@') || formData.email.length < 5) {
      setStatusMessage("Please enter a valid email address.");
      setIsError(true);
      setIsSubmitting(false);
      return;
    }

    try {
      const response = await fetch("/api/contact", { // Calling your backend API route
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json(); // Get the response from your API

      if (response.ok) {
        setStatusMessage(result.message || "Ticket submitted successfully!");
        setIsError(false);
        setFormData({ name: "", email: "", message: "" }); // Clear form on success
      } else {
        setStatusMessage(result.message || "Failed to submit ticket. Please try again.");
        setIsError(true);
      }
    } catch (error) {
      console.error("Contact form submission error on client:", error);
      setStatusMessage("An unexpected error occurred. Please try again later.");
      setIsError(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="contact" className="overflow-hidden py-16 md:py-20 lg:py-28">
      <div className="container">
        <div className="-mx-4 flex flex-wrap">
          <div className="w-full px-4 lg:w-7/12 xl:w-8/12">
            <div
              className="mb-12 rounded-sm bg-white px-8 py-11 shadow-three dark:bg-gray-dark sm:p-[55px] lg:mb-5 lg:px-8 xl:p-[55px]"
              data-wow-delay=".15s"
            >
              <h2 className="mb-3 text-2xl font-bold text-black dark:text-white sm:text-3xl lg:text-2xl xl:text-3xl">
                Need Help? Open a Ticket
              </h2>
              <p className="mb-12 text-base font-medium text-body-color dark:text-body-color-dark"> {/* Added dark mode text color */}
                Our support team will get back to you ASAP via email.
              </p>
              {/* Add onSubmit to the form */}
              <form onSubmit={handleSubmit}>
                <div className="-mx-4 flex flex-wrap">
                  <div className="w-full px-4 md:w-1/2">
                    <div className="mb-8">
                      <label
                        htmlFor="name"
                        className="mb-3 block text-sm font-medium text-dark dark:text-white"
                      >
                        Your Name
                      </label>
                      <input
                        type="text"
                        name="name" // Added name attribute
                        id="name"   // Added id for label association
                        placeholder="Enter your name"
                        value={formData.name} // Controlled component
                        onChange={handleChange} // Handle changes
                        required // HTML5 validation
                        className="border-stroke w-full rounded-sm border bg-[#f8f8f8] px-6 py-3 text-base text-body-color outline-none focus:border-primary dark:border-transparent dark:bg-[#2C303B] dark:text-body-color-dark dark:shadow-two dark:focus:border-primary dark:focus:shadow-none"
                      />
                    </div>
                  </div>
                  <div className="w-full px-4 md:w-1/2">
                    <div className="mb-8">
                      <label
                        htmlFor="email"
                        className="mb-3 block text-sm font-medium text-dark dark:text-white"
                      >
                        Your Email
                      </label>
                      <input
                        type="email"
                        name="email" // Added name attribute
                        id="email"   // Added id
                        placeholder="Enter your email"
                        value={formData.email} // Controlled component
                        onChange={handleChange} // Handle changes
                        required // HTML5 validation
                        className="border-stroke w-full rounded-sm border bg-[#f8f8f8] px-6 py-3 text-base text-body-color outline-none focus:border-primary dark:border-transparent dark:bg-[#2C303B] dark:text-body-color-dark dark:shadow-two dark:focus:border-primary dark:focus:shadow-none"
                      />
                    </div>
                  </div>
                  <div className="w-full px-4">
                    <div className="mb-8">
                      <label
                        htmlFor="message"
                        className="mb-3 block text-sm font-medium text-dark dark:text-white"
                      >
                        Your Message
                      </label>
                      <textarea
                        name="message" // Ensure name attribute matches state key
                        id="message"   // Added id
                        rows={5}
                        placeholder="Enter your Message"
                        value={formData.message} // Controlled component
                        onChange={handleChange} // Handle changes
                        required // HTML5 validation
                        className="border-stroke w-full resize-none rounded-sm border bg-[#f8f8f8] px-6 py-3 text-base text-body-color outline-none focus:border-primary dark:border-transparent dark:bg-[#2C303B] dark:text-body-color-dark dark:shadow-two dark:focus:border-primary dark:focus:shadow-none"
                      ></textarea>
                    </div>
                  </div>
                  <div className="w-full px-4">
                    <button
                      type="submit" // Ensure type is submit
                      disabled={isSubmitting} // Disable button while submitting
                      className="rounded-sm bg-primary px-9 py-4 text-base font-medium text-white shadow-submit duration-300 hover:bg-primary/90 dark:shadow-submit-dark disabled:cursor-not-allowed disabled:opacity-70"
                    >
                      {isSubmitting ? "Submitting..." : "Submit Ticket"}
                    </button>
                    {/* Display status message */}
                    {statusMessage && (
                      <p className={`mt-4 text-sm font-medium ${isError ? 'text-red-500' : 'text-green-500'}`}>
                        {statusMessage}
                      </p>
                    )}
                  </div>
                </div>
              </form>
            </div>
          </div>
          <div className="w-full px-4 lg:w-5/12 xl:w-4/12">
            <NewsLatterBox /> {/* Assuming this is just a display component */}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;