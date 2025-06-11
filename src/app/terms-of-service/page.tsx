/* eslint-disable react/no-unescaped-entities */

// src/app/terms-of-service/page.tsx

import Breadcrumb from "@/components/Common/Breadcrumb";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service | Melofy",
  description: "Please read our Terms of Service carefully before using the Melofy application.",
  // other metadata
};

const TermsOfServicePage = () => {
  const lastUpdated = "June 6, 2025"; // <<< UPDATE THIS TO THE CURRENT DATE WHEN FINALIZED

  return (
    <>
      <Breadcrumb
        pageName="Terms of Service"
        description={`Last Updated: ${lastUpdated}`}
      />

      <section className="pb-16 md:pb-20 lg:pb-24 pt-10">
        <div className="container">
          <div className="wow fadeInUp rounded-md bg-primary/[3%] px-8 py-10 dark:bg-dark sm:p-10 lg:px-8 xl:p-10">
            <h2 className="mb-6 text-2xl font-bold text-black dark:text-white sm:text-3xl">
              Welcome to Melofy!
            </h2>
            <p className="mb-4 text-base text-body-color dark:text-body-color-dark">
              These Terms of Service ("Terms") govern your access to and use of the Melofy web application (the "Service"), operated by Nyan Lin Htut ("us", "we", or "our") from Singapore. Please read these Terms carefully before using the Service.
            </p>
            <p className="mb-8 text-base text-body-color dark:text-body-color-dark">
              By accessing or using the Service, you agree to be bound by these Terms. If you disagree with any part of the terms, then you may not access the Service.
            </p>

            <h3 className="mb-4 text-xl font-semibold text-black dark:text-white">1. Service Description</h3>
            <p className="mb-6 text-base text-body-color dark:text-body-color-dark">
              Melofy allows users to generate Spotify playlists based on AI-interpreted mood, vibe, duration, and taste preferences. The Service utilizes the OpenAI API for AI processing and the Spotify API for track matching and playlist creation. User authentication may be required for certain features.
            </p>

            <h3 className="mb-4 text-xl font-semibold text-black dark:text-white">2. User Accounts</h3>
            <p className="mb-6 text-base text-body-color dark:text-body-color-dark">
              If the Service requires you to create an account, you must provide information that is accurate, complete, and current. Failure to do so constitutes a breach of the Terms, which may result in immediate termination of your account on our Service. You are responsible for safeguarding any password you use to access the Service and for any activities or actions under your password.
            </p>

            <h3 className="mb-4 text-xl font-semibold text-black dark:text-white">3. Use of Third-Party Services</h3>
            <p className="mb-6 text-base text-body-color dark:text-body-color-dark">
              Melofy integrates with third-party services, including Spotify and OpenAI. Your use of these services through Melofy is also governed by their respective terms of service and privacy policies. We encourage you to review them:
              <ul className="list-disc pl-6 mt-2">
                <li>Spotify Terms of Use: <a href="https://www.spotify.com/legal/end-user-agreement/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">https://www.spotify.com/legal/end-user-agreement/</a></li>
                <li>OpenAI Terms of Use: <a href="https://openai.com/policies/terms-of-use" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">https://openai.com/policies/terms-of-use</a></li>
              </ul>
              We are not responsible for the practices or content of these third-party services.
            </p>

            <h3 className="mb-4 text-xl font-semibold text-black dark:text-white">4. Intellectual Property</h3>
            <p className="mb-6 text-base text-body-color dark:text-body-color-dark">
              The Service and its original content (excluding content provided by users or third-party services like Spotify track data), features, and functionality are and will remain the exclusive property of Nyan Lin Htut and its licensors. The Service is protected by copyright, trademark, and other laws of both Singapore and foreign countries. Our trademarks and trade dress may not be used in connection with any product or service without the prior written consent of Nyan Lin Htut.
            </p>
            
            <h3 className="mb-4 text-xl font-semibold text-black dark:text-white">5. User Conduct and Prohibited Uses</h3>
            <p className="mb-6 text-base text-body-color dark:text-body-color-dark">
              You agree not to use the Service:
              <ul className="list-disc pl-6 mt-2">
                <li>In any way that violates any applicable local, national, or international law or regulation (including, without limitation, any laws regarding the export of data or software to and from Singapore or other countries).</li>
                <li>To transmit, or procure the sending of, any unsolicited or unauthorized advertising or promotional material or any other form of similar solicitation (spam).</li>
                <li>To impersonate or attempt to impersonate Nyan Lin Htut, another user, or any other person or entity.</li>
                <li>To engage in any other conduct that restricts or inhibits anyone's use or enjoyment of the Service, or which, as determined by us, may harm Nyan Lin Htut or users of the Service, or expose them to liability.</li>
                <li>To attempt to gain unauthorized access to, interfere with, damage, or disrupt any parts of the Service, the server on which the Service is stored, or any server, computer, or database connected to the Service.</li>
              </ul>
            </p>

            <h3 className="mb-4 text-xl font-semibold text-black dark:text-white">6. Disclaimer of Warranties; Limitation of Liability</h3>
            <p className="mb-6 text-base text-body-color dark:text-body-color-dark">
              The Service is provided "AS IS" and "AS AVAILABLE" without any warranties of any kind, express or implied. Nyan Lin Htut does not warrant that the Service will be uninterrupted, timely, secure, or error-free, or that defects will be corrected.
              To the fullest extent permitted by applicable law, in no event will Nyan Lin Htut, its affiliates, officers, directors, employees, agents, suppliers or licensors be liable for any indirect, incidental, special, consequential or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from (i) your access to or use of or inability to access or use the Service; (ii) any conduct or content of any third party on the Service; (iii) any content obtained from the Service; and (iv) unauthorized access, use or alteration of your transmissions or content, whether based on warranty, contract, tort (including negligence) or any other legal theory, whether or not we have been informed of the possibility of such damage.
            </p>

            <h3 className="mb-4 text-xl font-semibold text-black dark:text-white">7. Governing Law</h3>
            <p className="mb-6 text-base text-body-color dark:text-body-color-dark">
                These Terms shall be governed and construed in accordance with the laws of Singapore, without regard to its conflict of law provisions.
            </p>

            <h3 className="mb-4 text-xl font-semibold text-black dark:text-white">8. Changes to Terms</h3>
            <p className="mb-6 text-base text-body-color dark:text-body-color-dark">
              We reserve the right, at our sole discretion, to modify or replace these Terms at any time. If a revision is material, we will make reasonable efforts to provide at least 30 days' notice prior to any new terms taking effect. What constitutes a material change will be determined at our sole discretion. By continuing to access or use our Service after those revisions become effective, you agree to be bound by the revised terms.
            </p>

            <h3 className="mb-4 text-xl font-semibold text-black dark:text-white">9. Contact Us</h3>
            <p className="mb-6 text-base text-body-color dark:text-body-color-dark">
              If you have any questions about these Terms, please contact us at contact page.
            </p>
          </div>
        </div>
      </section>
    </>
  );
};

export default TermsOfServicePage;