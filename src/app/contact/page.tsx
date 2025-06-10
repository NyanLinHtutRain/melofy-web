import Breadcrumb from "@/components/Common/Breadcrumb";
import Contact from "@/components/Contact";

import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact Page | Melofy - AI Music Playlist App",
  description: "Reach out to us! You can submit a ticket for feedback, questions, or any issues you encounter while using Melofy.",
  // other metadata
};

const ContactPage = () => {
  return (
    <>
      <Breadcrumb
        pageName="Contact Page"
        description="You can submit a ticket for feedback, questions, or any issues you encounter while using Melofy."
      />

      <Contact />
    </>
  );
};

export default ContactPage;
