export interface AuthorData {
  initials?: string;
  firstName?: string;
  lastName?: string;
  jobTitle?: string;
}

interface PrivacyNotice {
  title: string;
  content: React.ReactNode;
}
export const authorData: AuthorData = {
  initials: 'MZS',
  firstName: 'Max',
  lastName: 'Zimmer-Smith',
  jobTitle: `Frontend Specialist`,
};

export const privacyNotice: PrivacyNotice = {
  title: 'Privacy Notice',
  content: (
    <div>
      <p className='font-bold pb-2'>Rate Limiting Data</p>
      <p className='text-sm pb-2 mb-6 border-b border-primary/50'>
        To prevent spam, we temporarily store a hashed version of your IP address when you submit the contact form. This
        data is securely stored for 24 hours and is only used to enforce a limit of one message per day.
      </p>
      <p className='font-bold pb-2'>Analytics</p>
      <p className='text-sm'>
        We use{' '}
        <a
          className='underline cursor-pointer'
          target='_blank'
          rel='noopener noreferrer'
          href='https://vercel.com/docs/analytics/privacy-policy'>
          Vercel Analytics
        </a>{' '}
        to monitor site performance and usage. Analytics data is collected on Vercel's servers and does not set cookies
        in your browser. Collected information may include IP addresses (for geolocation), browser type, device type,
        and page visits. Data is aggregated and anonymised where possible and is not shared with third parties beyond
        Vercel.
      </p>
    </div>
  ),
};
