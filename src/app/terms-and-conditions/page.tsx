import Nav from '@/app/components/Nav'
import Footer from '@/app/components/Footer';

const TermsAndConditions = () => (
  <div className='w-full h-full flex flex-col items-center'>
    <Nav />
    <div className='max-w-[1000px] flex flex-col py-24'>
      <p className='font-semibold tracking-tight'>Terms and Conditions</p>
      <p>Effective Date: 08/25</p>

      <h2 className='text-xl mt-8 font-semibold tradking-tight'>1. Eligibility</h2>
      <p className='mt-4'>
        To use this Site, you must be at least 18 years of age and capable of entering into legally binding agreements.
        By creating an account, you confirm that you meet these requirements.
      </p>

      <h2 className='text-xl mt-8 font-semibold tradking-tight'>2. Account Registration</h2>
      <p className='mt-4'>When you register for an account on <a href='https://nocorealtor.com' target='_blank' className='text-blue-700'>www.nocorealtor.com</a>, you agree to:</p>
      <ul className='list-disc mt-2'>
        <li>Provide accurate, current, and complete information.</li>
        <li>Maintain the security of your login credentials.</li>
        <li>Notify us immediately if you suspect unauthorized access to your account.</li>
      </ul>
      <p>Porter Real Estate reserves the right to suspend or delete your account for any misuse or inaccurate information.</p>

      <h2 className='text-xl mt-8 font-semibold tradking-tight'>3. Use of the Site</h2>
      <p className='mt-4'>
        You agree to use the Site solely for lawful purposes related to exploring, buying, or selling real estate.
        You may not:
      </p>
      <ul className='list-disc mt-2'>
        <li>Use the Site to advertise or solicit for a competing brokerage.</li>
        <li>Scrape or harvest listing data.</li>
        <li>Impersonate another individual or misrepresent your affiliation.</li>
      </ul>

      <h2 className='text-xl mt-8 font-semibold tradking-tight'>4. Marketing Communications</h2>
      <p className='mt-4'>
        By creating an account on 
        <a href='https://nocorealtor.com' target='_blank' className='ml-1 text-blue-700'>www.nocorealtor.com</a>, you expressly agree to receive 
        <span className='font-bold tracking-tight mx-1'>marketing emails and SMS/text messages</span> 
        from Porter Real Estate.
        These communications may include:
      </p>
      <ul className='list-disc mt-2'>
        <li>New property alerts</li>
        <li>Market updates</li>
        <li>Event invitations</li>
        <li>Promotions and real estate tips</li>
      </ul>
      <p className='mt-2'>You may opt out of:</p>
      <ul className='list-disc mt-2'>
        <li><span className='font-bold tracking-tight'>Emails</span> by clicking the “unsubscribe” link in any message.</li>
        <li><span className='font-bold tracking-tight'>Text messages</span> by replying “STOP” at any time. Standard messaging and data rates may apply.</li>
      </ul>

      <h2 className='text-xl mt-8 font-semibold tradking-tight'>5. Privacy Policy</h2>
      <p className='mt-4'>
        Your use of the Site is also governed by our Privacy Policy, which outlines how Porter Real Estate collects, uses, and protects your personal data.
      </p>

      <h2 className='text-xl mt-8 font-semibold tradking-tight'>6. Intellectual Property</h2>
      <p className='mt-4'>
        All content on the Site—text, images, logos, graphics, property data—is the property of Porter Real Estate or its licensors.
        You may not copy, reuse, or reproduce any material without written permission.
      </p>

      <h2 className='text-xl mt-8 font-semibold tradking-tight'>7. MLS Data and Listings</h2>
      <p className='mt-4'>
        Property listings and market data are provided for your personal, non-commercial use.
        Data is believed to be reliable but not guaranteed.
        Porter Real Estate is not responsible for any inaccuracies in listing information.
      </p>

      <h2 className='text-xl mt-8 font-semibold tradking-tight'>8. Third Party Services</h2>
      <p className='mt-4'>
        This Site may link to or use third-party tools, plugins, or services.
        Porter Real Estate is not responsible for the privacy practices or content of these external services.
      </p>

      <h2 className='text-xl mt-8 font-semibold tradking-tight'>9. Limitation of Liability</h2>
      <p>
        Porter Real Estate will not be liable for any damages arising out of your use or inability to use the Site, including indirect, incidental, or consequential losses.
      </p>

      <h2 className='text-xl mt-8 font-semibold tradking-tight'>10. Changes to These Terms</h2>
      <p className='mt-4'>
        We may update these Terms from time to time.
        If we make material changes, we will post a notice on the Site or notify you by email.
        Continued use of the Site after changes means you accept the revised Terms.
      </p>

      <h2 className='text-xl mt-8 font-semibold tradking-tight'>11. Governing Law</h2>
      <p className='mt-4'>
        These Terms are governed by the laws of the State of Colorado.
        Any disputes arising under these Terms shall be subject to the exclusive jurisdiction of the courts located in Larimer County, Colorado.
      </p>

      <h2 className='text-xl mt-8 font-semibold tradking-tight'>12. Contact Information</h2>
      <p className='mt-4'>If you have any questions or concerns about these Terms, please contact us at:</p>
      <p className='mt-2 font-bold tracking-tight'>Porter Real Estate</p>
      <p >Fort Collins, CO 80524</p>
      <p >clientcare@nocorealtor.com</p>
      <p >(970) 510-8414</p>
      <a className='text-blue-700' href='https://nocorealtor.com' target='_blank'>www.nocorealtor.com</a>
    </div>
    <Footer />
  </div>
);

export default TermsAndConditions
