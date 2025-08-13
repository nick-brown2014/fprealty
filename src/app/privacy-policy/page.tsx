import Nav from '@/app/components/Nav'
import Footer from '@/app/components/Footer';

const PrivacyPolicy = () => (
  <div className='w-full h-full flex flex-col items-center'>
    <Nav />
    <div className='max-w-[1000px] flex flex-col py-24'>
      <p className='font-semibold tracking-tight'>Privacy Policy</p>
      <p>Effective Date: 08/25</p>

      <h2 className='text-xl mt-8 font-semibold tradking-tight'>1. Information We Collect</h2>
      <p className='mt-4'>We collect personal information when you:</p>
      <ul className='list-disc mt-2'>
        <li>Create an account</li>
        <li>Fill out a contact form or property inquiry</li>
        <li>Sign up for property alerts or newsletters</li>
        <li>Interact with the Site or our communications</li>
      </ul>
      <p className='font-semibold-tracking-tight mt-4'>Types of information we may collect include:</p>
      <ul className='list-disc mt-2'>
        <li>Name, email address, phone number</li>
        <li>Property preferences and search activity</li>
        <li>Location data (if you opt in)</li>
        <li>IP address, browser type, and device data</li>
      </ul>

      <h2 className='text-xl mt-8 font-semibold tradking-tight'>2. How We Use Your Information</h2>
      <p className='mt-4'>We use your information to:</p>
      <ul className='list-disc mt-2'>
        <li>Provide and personalize your experience on the Site</li>
        <li>Send you property updates, market insights, and promotional offers</li>
        <li>Respond to your inquiries or requests</li>
        <li>Improve the Site&#39;s functionality and content</li>
        <li>Comply with legal and regulatory obligations</li>
      </ul>
      
      <p className='mt-4'>
        By submitting your contact information, you consent to receive
        <span className='font-bold tracking-tight mx-1'>email and SMS/text communications</span>
        from Porter Real Estate.
        You can unsubscribe or opt out at any time:
      </p>
      <ul className='list-disc mt-2'>
        <li>Emails: click “unsubscribe” at the bottom of any message</li>
        <li>Texts: reply “STOP” to any message</li>
      </ul>

      <h2 className='text-xl mt-8 font-semibold tradking-tight'>3. Sharing of Information</h2>
      <p className='mt-4'>We do <span className='font-bold tracking-tight'>not sell your personal information</span> to third parties.</p>
      <p className='mt-2'>We may share your information with:</p>
      <ul className='list-disc mt-2'>
        <li>Real estate service providers or platforms we partner with</li>
        <li>Vendors or contractors who help us operate the Site</li>
        <li>Legal authorities when required by law</li>
      </ul>
      <p className='mt-2'>
        These parties are obligated to keep your information confidential and use it only as necessary to provide their services.
      </p>

      <h2 className='text-xl mt-8 font-semibold tradking-tight'>4. Cookies and Tracking Technologies</h2>
      <p className='mt-4'>We use cookies and similar technologies to:</p>
      <ul className='list-disc mt-2'>
        <li>Analyze website traffic</li>
        <li>Remember your preferences</li>
        <li>Improve site performance</li>
      </ul>
      <p className='mt-2'>
        You can modify your browser settings to disable cookies, but this may impact your experience on the Site.
      </p>

      <h2 className='text-xl mt-8 font-semibold tradking-tight'>5. Data Security</h2>
      <p className='mt-4'>
        We take reasonable steps to protect your information from unauthorized access, use, or disclosure.
        However, no method of transmission over the internet is completely secure, and we cannot guarantee absolute security.
      </p>

      <h2 className='text-xl mt-8 font-semibold tradking-tight'>6. Third-Party Links</h2>
      <p className='mt-4'>
        Our Site may contain links to third-party websites.
        This Privacy Policy applies only to our Site, and we are not responsible for the privacy practices of other websites.
      </p>

      <h2 className='text-xl mt-8 font-semibold tradking-tight'>7. Children&#39;s Privacy</h2>
      <p className='mt-4'>
        This Site is intended for users 18 years and older.
        We do not knowingly collect personal information from children under 13.
      </p>

      <h2 className='text-xl mt-8 font-semibold tradking-tight'>8. Your Choices</h2>
      <p className='mt-4'>You can:</p>
      <ul className='list-disc mt-2'>
        <li>Update your contact information in your account</li>
        <li>Unsubscribe from marketing communications</li>
        <li>Request that we delete your account and data</li>
      </ul>
      <p className='mt-2'>To make a data request, contact us using the information below.</p>

      <h2 className='text-xl mt-8 font-semibold tradking-tight'>9. Changes to This Policy</h2>
      <p className='mt-4'>
        We may update this Privacy Policy from time to time.
        If we make significant changes, we will post a notice on the Site or notify you via email.
        Your continued use of the Site after changes means you accept the updated policy.
      </p>

      <h2 className='text-xl mt-8 font-semibold tradking-tight'>10. Contact Us</h2>
      <p className='mt-4'>If you have any questions or concerns about this Privacy Policy, please contact us at:</p>
      <p className='mt-2 font-bold tracking-tight'>Porter Real Estate</p>
      <p >Fort Collins, CO 80524</p>
      <p >clientcare@nocorealtor.com</p>
      <p >(970) 510-8414</p>
      <a className='text-blue-700' href='https://nocorealtor.com' target='_blank'>www.nocorealtor.com</a>
    </div>
    <Footer />
  </div>
);

export default PrivacyPolicy
