'use client'

import { FormEvent, useState } from 'react'
import NextArrow from '@/app/components/wizards/NextArrow'
import PrevArrow from '@/app/components/wizards/PrevArrow'

declare global {
  interface Window {
    gtag?: (command: string, ...args: unknown[]) => void
    dataLayer?: Record<string, unknown>[]
  }
}

type HomeValuationData = {
  address: string
  propertyType: string
  bedrooms: string
  bathrooms: string
  squareFootage: string
  timeframe: string
  firstName: string
  lastName: string
  phone: string
  email: string
  consent: boolean
}

type ApiResponse = {
  ok?: boolean
  error?: string
}

const initialForm: HomeValuationData = {
  address: '',
  propertyType: '',
  bedrooms: '',
  bathrooms: '',
  squareFootage: '',
  timeframe: '',
  firstName: '',
  lastName: '',
  phone: '',
  email: '',
  consent: false,
}

const timeframes = ['ASAP', 'Within 3 months', '3–6 months', '6–12 months', '12+ months', 'Just curious']
const propertyTypes = ['Single-family house', 'Townhome', 'Condo', 'Multi-family property', 'Other']
const inputClasses = 'w-full border border-black/15 bg-white px-4 py-3.5 font-body text-base outline-none transition-colors placeholder:text-black/35 focus:border-primary'
const labelClasses = 'mb-2 block font-condensed text-xs font-bold uppercase tracking-[0.16em] text-black/70'

const HomeValuationForm = () => {
  const [form, setForm] = useState<HomeValuationData>(initialForm)
  const [step, setStep] = useState(0)
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const updateField = <K extends keyof HomeValuationData>(field: K, value: HomeValuationData[K]) => {
    setForm(current => ({ ...current, [field]: value }))
    setError('')
  }

  const validateStep = () => {
    if (step === 0 && form.address.trim().length < 5) {
      setError('Please enter your property address.')
      return false
    }
    if (step === 1 && (!form.propertyType || !form.bedrooms || !form.bathrooms || !form.squareFootage || Number(form.squareFootage) <= 0)) {
      setError('Please complete each property detail.')
      return false
    }
    if (step === 2 && !form.timeframe) {
      setError('Please choose a timeframe.')
      return false
    }
    if (
      step === 3 &&
      (!form.firstName.trim() ||
        !form.lastName.trim() ||
        form.phone.replace(/\D/g, '').length < 7 ||
        !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email) ||
        !form.consent)
    ) {
      setError('Please complete your contact details and consent to continue.')
      return false
    }
    setError('')
    return true
  }

  const handleNext = () => {
    if (validateStep()) setStep(current => Math.min(current + 1, 3))
  }

  const handlePrevious = () => {
    setError('')
    setStep(current => Math.max(current - 1, 0))
  }

  const trackSubmission = () => {
    if (typeof window.gtag === 'function' && process.env.NEXT_PUBLIC_GADS_HV_LABEL) {
      window.gtag('event', 'conversion', {
        send_to: `AW-668025904/${process.env.NEXT_PUBLIC_GADS_HV_LABEL}`,
      })
    }
    window.dataLayer = window.dataLayer || []
    window.dataLayer.push({ event: 'generate_lead', form: 'home_valuation' })
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!validateStep()) return

    setSubmitting(true)
    setError('')
    try {
      const response = await fetch('/api/home-valuation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      const result: ApiResponse = await response.json().catch(() => ({}))
      if (!response.ok || !result.ok) throw new Error(result.error || 'Something went wrong. Please try again.')
      setSubmitted(true)
      trackSubmission()
    } catch (submissionError) {
      setError(submissionError instanceof Error ? submissionError.message : 'Something went wrong. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  const StepLabel = ({ index, label }: { index: number; label: string }) => (
    <div className={`flex items-center gap-2 ${index <= step ? 'text-primary' : 'text-black/35'}`}>
      <span className={`flex h-6 w-6 items-center justify-center rounded-full border font-condensed text-xs font-bold ${index < step ? 'border-primary bg-primary text-white' : index === step ? 'border-primary' : 'border-current'}`}>
        {index < step ? '✓' : index + 1}
      </span>
      <span className='font-condensed text-[11px] font-bold uppercase tracking-[0.13em]'>{label}</span>
    </div>
  )

  if (submitted) {
    return (
      <div className='flex min-h-[470px] w-full flex-col items-center justify-center bg-white px-6 py-12 text-center shadow-[0_8px_40px_-12px_rgba(0,0,0,0.18)] md:px-12'>
        <div className='mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-primary font-serif text-3xl text-white'>✓</div>
        <h3 className='font-serif text-3xl font-bold tracking-tight text-black md:text-4xl'>Thanks — you&#39;re all set!</h3>
        <p className='mt-4 max-w-md font-body text-base leading-relaxed text-black/65'>Fred will personally prepare your home value report and send it within 24 hours.</p>
        <p className='mt-5 font-condensed text-sm font-bold uppercase tracking-[0.12em] text-black/60'>
          Prefer to talk now? <a href='tel:+19705108414' className='text-primary hover:underline'>(970) 510-8414</a>
        </p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className='w-full bg-white p-6 shadow-[0_8px_40px_-12px_rgba(0,0,0,0.18)] md:p-10'>
      <div className='mb-8 hidden items-center justify-center gap-4 md:flex'>
        <StepLabel index={0} label='Address' />
        <span className='h-px w-8 bg-black/15' />
        <StepLabel index={1} label='Property' />
        <span className='h-px w-8 bg-black/15' />
        <StepLabel index={2} label='Timing' />
        <span className='h-px w-8 bg-black/15' />
        <StepLabel index={3} label='Contact' />
      </div>
      <div className='mb-7 flex items-center justify-between md:hidden'>
        <button type='button' onClick={handlePrevious} disabled={step === 0} className='flex items-center gap-1 font-condensed text-xs font-bold uppercase tracking-[0.12em] disabled:opacity-30'>← Prev</button>
        <span className='font-condensed text-xs font-bold uppercase tracking-[0.15em] text-primary'>Step {step + 1} of 4</span>
        <button type='button' onClick={handleNext} disabled={step === 3} className='flex items-center gap-1 font-condensed text-xs font-bold uppercase tracking-[0.12em] disabled:opacity-30'>Next →</button>
      </div>

      {step === 0 && (
        <div className='relative'>
          <NextArrow handleClick={handleNext} />
          <p className='mb-2 font-condensed text-xs font-bold uppercase tracking-[0.18em] text-primary'>Step 1 · Your property</p>
          <h3 className='font-serif text-2xl font-bold tracking-tight text-black md:text-3xl'>Where is your home?</h3>
          <p className='mt-2 mb-7 font-body text-sm leading-relaxed text-black/60'>Start with the address and we&#39;ll prepare a valuation for your property.</p>
          <label className={labelClasses} htmlFor='valuation-address'>Property address</label>
          <input id='valuation-address' value={form.address} onChange={event => updateField('address', event.target.value)} className={inputClasses} placeholder='123 Main Street, Fort Collins, CO' autoComplete='street-address' />
        </div>
      )}

      {step === 1 && (
        <div className='relative'>
          <PrevArrow handleClick={handlePrevious} />
          <NextArrow handleClick={handleNext} />
          <p className='mb-2 font-condensed text-xs font-bold uppercase tracking-[0.18em] text-primary'>Step 2 · Property details</p>
          <h3 className='font-serif text-2xl font-bold tracking-tight text-black md:text-3xl'>Tell us about your home</h3>
          <div className='mt-6 grid gap-5 sm:grid-cols-2'>
            <div className='sm:col-span-2'>
              <label className={labelClasses} htmlFor='property-type'>Property type</label>
              <select id='property-type' value={form.propertyType} onChange={event => updateField('propertyType', event.target.value)} className={inputClasses}>
                <option value=''>Select property type</option>
                {propertyTypes.map(type => <option key={type} value={type}>{type}</option>)}
              </select>
            </div>
            <div>
              <label className={labelClasses} htmlFor='bedrooms'>Bedrooms</label>
              <input id='bedrooms' type='number' min='0' value={form.bedrooms} onChange={event => updateField('bedrooms', event.target.value)} className={inputClasses} placeholder='3' />
            </div>
            <div>
              <label className={labelClasses} htmlFor='bathrooms'>Bathrooms</label>
              <input id='bathrooms' type='number' min='0' step='0.5' value={form.bathrooms} onChange={event => updateField('bathrooms', event.target.value)} className={inputClasses} placeholder='2' />
            </div>
            <div className='sm:col-span-2'>
              <label className={labelClasses} htmlFor='square-footage'>Square footage</label>
              <input id='square-footage' type='number' min='1' value={form.squareFootage} onChange={event => updateField('squareFootage', event.target.value)} className={inputClasses} placeholder='2,500' />
            </div>
          </div>
        </div>
      )}

      {step === 2 && (
        <div className='relative'>
          <PrevArrow handleClick={handlePrevious} />
          <NextArrow handleClick={handleNext} />
          <p className='mb-2 font-condensed text-xs font-bold uppercase tracking-[0.18em] text-primary'>Step 3 · Your timing</p>
          <h3 className='font-serif text-2xl font-bold tracking-tight text-black md:text-3xl'>When are you thinking about selling?</h3>
          <div className='mt-7 grid grid-cols-2 gap-3 sm:grid-cols-3'>
            {timeframes.map(timeframe => (
              <button key={timeframe} type='button' onClick={() => updateField('timeframe', timeframe)} className={`min-h-[68px] border px-3 py-3 font-condensed text-sm font-bold uppercase tracking-[0.06em] transition-colors ${form.timeframe === timeframe ? 'border-primary bg-primary text-white' : 'border-black/15 bg-white text-black hover:border-primary hover:bg-primary/[0.04]'}`}>
                {timeframe}
              </button>
            ))}
          </div>
        </div>
      )}

      {step === 3 && (
        <div>
          <PrevArrow handleClick={handlePrevious} />
          <p className='mb-2 font-condensed text-xs font-bold uppercase tracking-[0.18em] text-primary'>Step 4 · Your details</p>
          <h3 className='font-serif text-2xl font-bold tracking-tight text-black md:text-3xl'>Where should we send your report?</h3>
          <div className='mt-6 grid gap-5 sm:grid-cols-2'>
            <div>
              <label className={labelClasses} htmlFor='first-name'>First name</label>
              <input id='first-name' value={form.firstName} onChange={event => updateField('firstName', event.target.value)} className={inputClasses} autoComplete='given-name' />
            </div>
            <div>
              <label className={labelClasses} htmlFor='last-name'>Last name</label>
              <input id='last-name' value={form.lastName} onChange={event => updateField('lastName', event.target.value)} className={inputClasses} autoComplete='family-name' />
            </div>
            <div>
              <label className={labelClasses} htmlFor='phone'>Phone</label>
              <input id='phone' type='tel' value={form.phone} onChange={event => updateField('phone', event.target.value)} className={inputClasses} autoComplete='tel' />
            </div>
            <div>
              <label className={labelClasses} htmlFor='email'>Email</label>
              <input id='email' type='email' value={form.email} onChange={event => updateField('email', event.target.value)} className={inputClasses} autoComplete='email' />
            </div>
          </div>
          <label className='mt-6 flex cursor-pointer items-start gap-3 text-sm leading-relaxed text-black/60'>
            <input type='checkbox' checked={form.consent} onChange={event => updateField('consent', event.target.checked)} className='mt-1 h-4 w-4 accent-primary' />
            <span>I agree to be contacted about my home valuation and understand I can opt out at any time.</span>
          </label>
        </div>
      )}

      {error && <p className='mt-6 border-l-2 border-primary bg-primary/[0.05] px-4 py-3 text-sm text-primary' role='alert'>{error}</p>}
      <div className='mt-8 flex items-center justify-between gap-4 border-t border-black/10 pt-6'>
        <button type='button' onClick={handlePrevious} disabled={step === 0} className='font-condensed text-xs font-bold uppercase tracking-[0.16em] text-black/65 transition-colors hover:text-primary disabled:invisible'>← Back</button>
        {step < 3 ? (
          <button type='button' onClick={handleNext} className='bg-primary px-7 py-3.5 font-condensed text-sm font-bold uppercase tracking-[0.14em] text-white transition-colors hover:bg-primary/90'>Continue →</button>
        ) : (
          <button type='submit' disabled={submitting} className='bg-primary px-7 py-3.5 font-condensed text-sm font-bold uppercase tracking-[0.14em] text-white transition-colors hover:bg-primary/90 disabled:cursor-wait disabled:opacity-60'>{submitting ? 'Sending…' : 'Get My Free Home Value'}</button>
        )}
      </div>
    </form>
  )
}

export default HomeValuationForm
