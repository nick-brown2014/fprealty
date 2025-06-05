'use client'

import { useEffect, useState } from "react"
import { SellingWizardOptions, WizardOption } from "@/app/types/WizardTypes"
import NextArrow from '@/app/components/wizards/NextArrow'
import PrevArrow from '@/app/components/wizards/PrevArrow'

const defaultSellingWizard: SellingWizardOptions = {
  address: '',
  timeframe: '',
  worth: '',
  propertyInfo: ''
}

const timeframes: WizardOption[] = [
  { label: 'ASAP', value: 'asap'},
  { label: '3 months', value: '3' },
  { label: '3 - 6 months', value: '3-6' },
  { label: '6 - 12 months', value: '6-12' },
  { label: '12+ months', value: '12+' },
]

const worths: WizardOption[] = [
  { label: '350k to 500k', value: '350-500' },
  { label: '500k to 750k', value: '500-750' },
  { label: '750k to 1mil', value: '750-1mil' },
  { label: '1mil to 1.5mil', value: '1mil-1.5mil' },
  { label: '1.5mil to 2mil', value: '1.5mil-2mil' },
  { label: 'Over 2mil', value: '2mil+' },
]


const SellingWizard = () => {
  const [sellingWizardForm, setSellingWizardForm] = useState<SellingWizardOptions>(defaultSellingWizard)
  const [frameNum, setFrameNum] = useState<number>(0)
  
  useEffect(() => {
    if (!!sellingWizardForm.address && !!sellingWizardForm.timeframe && !!sellingWizardForm.worth && !!sellingWizardForm.propertyInfo) {
      setFrameNum(4)
    }
  }, [sellingWizardForm])

  const handleChangeFrame = (newFrame: number) => {
    if (newFrame === frameNum) return
    setFrameNum(newFrame)
  }

  const handleResetForm = () => {
    setSellingWizardForm(defaultSellingWizard)
    setFrameNum(0)
  }

  const handleSubmit = () => {
    window.open('https://m.nocorealtor.com/book-with-me-page-4826')
  }

  const updateTimeframe = (newTimeframe: string) => {
    const newWizardForm: SellingWizardOptions = {...sellingWizardForm, timeframe: newTimeframe}
    setSellingWizardForm(newWizardForm)
  }

  const updateWorth = (newWorth: string) => {
    const newWizardForm: SellingWizardOptions = {...sellingWizardForm, worth: newWorth}
    setSellingWizardForm(newWizardForm)
  }

  const renderTimeframes = () => (
    <div className='w-full flex flex-col gap-12 items-center'>
      <h1 className='font-semibold tracking-tight text-3xl lg:text-5xl'>When do you need to sell?</h1>
      <div className='w-full flex flex-col lg:flex-row gap-12 items-center flex-wrap justify-center relative px-12'>
        <NextArrow handleClick={() => setFrameNum(2)} />
        <PrevArrow handleClick={() => setFrameNum(0)} />
        {timeframes.map(option => {
          const isSelected = option.value === sellingWizardForm.timeframe
          return (
            <div
              key={option.value}
              className={`transition duration-500 w-[200px] h-[200px] border-2 border-black items-center justify-center rounded-xl flex flex-col gap-4 ${isSelected ? 'cursor-default text-white bg-black' : 'cursor-pointer hover:opacity-50'}`}
              onClick={() => updateTimeframe(option.value)}
            >
              <img src={`${isSelected ? '/timeframe-white.png' : '/timeframe.png'}`} height={50} width={50} />
              <p className='font-bold tracking-tight text-xl'>{option.label}</p>
            </div>
          )
        })}
      </div>
    </div>
  )

  const renderAddressForm = () => (
    <div className='w-full flex flex-col gap-12 items-center'>
      <h1 className='font-semibold tracking-tight text-2xl lg:text-4xl text-center'>What is the address of the property you&#39;re selling?</h1>
    </div>
  )

  const renderInfoForm = () => (
    <div className='w-full flex flex-col gap-12 items-center'>
      <h1 className='font-semibold tracking-tight text-2xl lg:text-4xl text-center'>Tell us a little about the property</h1>
    </div>
  )

  const renderWorths = () => (
    <div className='w-full flex flex-col gap-12 items-center'>
      <h1 className='font-semibold tracking-tight text-2xl lg:text-4xl text-center'>What do you think your property is worth?</h1>
      <div className='w-full flex flex-col lg:flex-row gap-12 items-center flex-wrap justify-center relative'>
        <NextArrow handleClick={() => setFrameNum(3)} />
        <PrevArrow handleClick={() => setFrameNum(1)} />
        {worths.map(option => {
          const isSelected = option.value === sellingWizardForm.worth
          return (
            <div
              key={option.value}
              className={`transition duration-500 w-[200px] h-[200px] border-2 border-black items-center justify-center rounded-xl flex flex-col gap-4 ${isSelected ? 'cursor-default text-white bg-black' : 'cursor-pointer hover:opacity-50'}`}
              onClick={() => updateWorth(option.value)}
            >
              <img src={`${isSelected ? '/budget-white.png' : '/budget.png'}`} height={50} width={50} />
              <p className='font-bold tracking-tight text-xl'>{option.label}</p>
            </div>
          )
        })}
      </div>
    </div>
  )

  const renderContact = () => (
    <div className='w-full flex flex-col justify-center items-center'>
      <h1 className='font-semibold tracking-tight text-3xl lg:text-5xl'>Thank you!</h1>
      <h2 className='font-semibold tracking-tight text-2xl lg:text-3xl mt-8'>Next step: Book a meeting with us</h2>
      <div className='justify-center my-12 gap-8 flex'>
        <p
          className='cursor-pointer py-[4px] px-8 lg:px-12 text-2xl lg:text-3xl font-bold bg-linear-to-r from-primary to-5% to-primary from-5% to-white text-black shadow-xl hover:text-white hover:to-primary transition duration-500'
          onClick={handleSubmit}
        >
          Book a meeting
        </p>
        <p
          className='cursor-pointer py-[4px] px-8 lg:px-12 text-2xl lg:text-3xl font-bold bg-linear-to-r from-primary to-5% to-primary from-5% to-white text-black shadow-xl hover:text-white hover:to-primary transition duration-500'
          onClick={handleResetForm}
        >
          Start over
        </p>
      </div>
    </div>
  )

  const handlePrev = () => {
    if (frameNum > 0) setFrameNum(frameNum - 1)
  }

  const handleNext = () => {
    if (frameNum < 3) setFrameNum(frameNum + 1)
  }

  if (frameNum === 4) return renderContact()
  return (
    <div className='w-full shadow-2xl p-4 lg:p-8 flex flex-col items-center min-h-96 w-[90vw] lg:w-[1000px] bg-white'>
      <div className='flex items-center justify-center w-full mb-8'>
        <img src='/chevron-left.png' onClick={handlePrev} className={`${frameNum === 0 ? 'opacity-50' : 'cursor-pointer'} mr-4 h-8 w-8 hidden md:block`} />
        <p onClick={() => handleChangeFrame(0)} className={`mr-1 font-semibold tracking-tight ${frameNum === 0 ? 'text-primary cursor-default' : 'cursor-pointer'}`}>ADDRESS</p>
        {sellingWizardForm.address && <img src='/check-primary.png' height={12} width={12} />}
        <p onClick={() => handleChangeFrame(1)} className={`ml-2 mr-1 lg:ml-6 font-semibold tracking-tight ${frameNum === 1 ? 'text-primary cursor-default' : 'cursor-pointer'}`}>TIMEFRAME</p>
        {sellingWizardForm.timeframe && <img src='/check-primary.png' height={12} width={12} />}
        <p onClick={() => handleChangeFrame(2)} className={`ml-2 mr-1 lg:ml-6 font-semibold tracking-tight ${frameNum === 2 ? 'text-primary cursor-default' : 'cursor-pointer'}`}>VALUE</p>
        {sellingWizardForm.worth && <img src='/check-primary.png' height={12} width={12} />}
        <p onClick={() => handleChangeFrame(3)} className={`ml-2 mr-1 lg:ml-6 font-semibold tracking-tight ${frameNum === 3 ? 'text-primary cursor-default' : 'cursor-pointer'}`}>INFO</p>
        {sellingWizardForm.propertyInfo && <img src='/check-primary.png' height={12} width={12} />}
        <img src='/chevron-right.png' onClick={handleNext} className={`${frameNum === 3 ? 'opacity-50' : 'cursor-pointer'} ml-4 h-8 w-8 hidden md:block`} />
      </div>
      <div className='md:hidden flex items-center justify-between w-full mb-8'>
        <div onClick={handlePrev} className={`${frameNum === 0 ? 'opacity-50' : 'cursor-pointer'} flex items-center`}>
          <img src='/chevron-left.png' className='mr-2 h-6 w-6' />
          <p>Previous</p>
        </div>
        <div onClick={handleNext} className={`${frameNum === 2 ? 'opacity-50' : 'cursor-pointer'} flex items-center`}>
          <p>Next</p>
          <img src='/chevron-right.png' className='ml-2 h-6 w-6' />
        </div>
      </div>
      { frameNum === 0 && renderAddressForm() }
      { frameNum === 1 && renderTimeframes() }
      { frameNum === 2 && renderWorths() }
      { frameNum === 3 && renderInfoForm() }
      <div className='md:hidden flex items-center justify-between w-full my-8'>
        <div onClick={handlePrev} className={`${frameNum === 0 ? 'opacity-50' : 'cursor-pointer'} flex items-center`}>
          <img src='/chevron-left.png' className='mr-2 h-6 w-6' />
          <p>Previous</p>
        </div>
        <div onClick={handleNext} className={`${frameNum === 3 ? 'opacity-50' : 'cursor-pointer'} flex items-center`}>
          <p>Next</p>
          <img src='/chevron-right.png' className='ml-2 h-6 w-6' />
        </div>
      </div>
    </div>
  )
}

export default SellingWizard
