

const Footer = () => (
  <div className='w-full bg-foreground px-8 py-4 justify-center'>
    <div className='justify-between items-center gap-8 max-w-[1200px] w-full'>
      <img src='/logo-white.png' className='w-42 h-42' />
      <div className='flex-col gap-2'>
        <p className='text-background font-semibold tracking-tight'>215 Circle Dr</p>
        <p className='text-background font-semibold tracking-tight'>Fort Collins, CO, 80524</p>
        <p className='text-background font-semibold tracking-tight'>(970) 231-4272</p>
        <p className='text-background font-semibold tracking-tight'>fred@porterrestate.com</p>
      </div>
      <div className='flex-col gap-2 self-end max-w-[600px]'>
        <p className='text-background font-semibold tracking-tight'>Privacy policy</p>
        <p className='text-background text-xs'>
          IDX information is provided exclusively for consumers’ personal, non-commercial use, that it may not be used for any purpose other than to identify prospective properties consumers may be interested in purchasing, and that the data is deemed reliable but is not guaranteed accurate by the MLS.
          <br></br>
          The MLS may, at its discretion, require use of other disclaimers as necessary to protect participants and/or the MLS from liability. Information deemed reliable but not guaranteed by the MLS. Information source: Information and Real Estate Services, LLC.
          <br></br>
          Provided for limited non-commercial use only under IRES Rules © Copyright 2018 IRES DMCA Notice
        </p>
      </div>
    </div>
  </div>
)

export default Footer