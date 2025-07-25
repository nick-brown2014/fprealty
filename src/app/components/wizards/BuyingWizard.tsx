'use client'

import { useEffect, useState } from "react"
import { BuyingWizardOptions, WizardOption } from "@/app/types/WizardTypes"
import NextArrow from '@/app/components/wizards/NextArrow'
import PrevArrow from '@/app/components/wizards/PrevArrow'

const defaultBuyingWizard: BuyingWizardOptions = {
  timeframe: '',
  budget: '',
  preApproval: ''
}

const timeframes: WizardOption[] = [
  { label: '1 - 3 months', value: '1 - 3 months' },
  { label: '3 - 6 months', value: '3 - 6 months' },
  { label: '6 - 12 months', value: '6 - 12 months' },
  { label: '12+ months', value: 'Over 12 months' },
]

const budgets: WizardOption[] = [
  { label: '350k to 500k', value: '350,000 - 500,000' },
  { label: '500k to 750k', value: '500,000 - 750,000' },
  { label: '750k to 1mil', value: '750,000 - 1mil' },
  { label: '1mil to 1.5mil', value: '1,000,000 - 1,500,000' },
  { label: '1.5mil to 2mil', value: '1,500,000 - 2,000,000' },
  { label: 'Over 2mil', value: 'Over 2,000,000' },
]

const preApprovals: WizardOption[] = [
  { label: 'Yes!', value: 'Yes' },
  { label: 'No, but I’m working with a lender licensed in Colorado', value: 'No, with lender' },
  { label: 'No, please refer me to a lender we trust', value: 'No, without lender' },
  { label: 'Cash buyer', value: 'Cash' },
]


const BuyingWizard = () => {
  const [buyingWizardForm, setBuyingWizardForm] = useState<BuyingWizardOptions>(defaultBuyingWizard)
  const [widgetURL, setWidgetURL] = useState<string>('')
  const [frameNum, setFrameNum] = useState<number>(0)
  
  useEffect(() => {
    if (!!buyingWizardForm.budget && !!buyingWizardForm.preApproval && !!buyingWizardForm.timeframe) {
      const newURL = `https://link.myagenthq.com/widget/booking/68MGrKpb0Yy6XFlSTr5K?time_frame1=${buyingWizardForm.timeframe}&budget=${buyingWizardForm.budget}&pre_qualification=${buyingWizardForm.preApproval}`
      setWidgetURL(newURL)
      setFrameNum(3)
    }
  }, [buyingWizardForm])

  const handleChangeFrame = (newFrame: number) => {
    if (newFrame === frameNum) return
    setFrameNum(newFrame)
  }

  const updateTimeframe = (newTimeframe: string) => {
    const newWizardForm: BuyingWizardOptions = {...buyingWizardForm, timeframe: newTimeframe}
    setBuyingWizardForm(newWizardForm)
    setTimeout(() => {
      setFrameNum(1)
    }, 250)
  }

  const updateBudget = (newBudget: string) => {
    const newWizardForm: BuyingWizardOptions = {...buyingWizardForm, budget: newBudget}
    setBuyingWizardForm(newWizardForm)
    setTimeout(() => {
      setFrameNum(2)
    }, 250)
  }

  const updateApproval = (newApproval: string) => {
    const newWizardForm: BuyingWizardOptions = {...buyingWizardForm, preApproval: newApproval}
    setBuyingWizardForm(newWizardForm)
  }

  const renderTimeframes = () => (
    <div className='w-full flex flex-col gap-12 items-center'>
      <h1 className='font-semibold tracking-tight text-3xl lg:text-5xl'>What is your time frame?</h1>
      <div className='w-full flex flex-col lg:flex-row gap-12 items-center flex-wrap justify-center relative px-12'>
        <NextArrow handleClick={() => setFrameNum(1)} />
        {timeframes.map(option => {
          const isSelected = option.value === buyingWizardForm.timeframe
          return (
            <div
              key={option.value}
              className={`transition duration-500 w-[250px] h-[250px] border-2 border-black items-center justify-center rounded-xl flex flex-col gap-4 ${isSelected ? 'cursor-default text-white bg-black' : 'cursor-pointer hover:opacity-50'}`}
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

  const renderBudgets = () => (
    <div className='w-full flex flex-col gap-12 items-center'>
      <h1 className='font-semibold tracking-tight text-3xl lg:text-5xl'>What is your budget?</h1>
      <div className='w-full flex flex-col lg:flex-row gap-12 items-center flex-wrap justify-center relative'>
        <NextArrow handleClick={() => setFrameNum(2)} />
        <PrevArrow handleClick={() => setFrameNum(0)} />
        {budgets.map(option => {
          const isSelected = option.value === buyingWizardForm.budget
          return (
            <div
              key={option.value}
              className={`transition duration-500 w-[200px] h-[200px] border-2 border-black items-center justify-center rounded-xl flex flex-col gap-4 ${isSelected ? 'cursor-default text-white bg-black' : 'cursor-pointer hover:opacity-50'}`}
              onClick={() => updateBudget(option.value)}
            >
              <img src={`${isSelected ? '/budget-white.png' : '/budget.png'}`} height={50} width={50} />
              <p className='font-bold tracking-tight text-xl'>{option.label}</p>
            </div>
          )
        })}
      </div>
    </div>
  )

  const renderPreapprovals = () => (
    <div className='w-full flex flex-col gap-12 items-center'>
      <h1 className='font-semibold text-center tracking-tight text-2xl lg:text-4xl'>Do you have a pre-approval letter?</h1>
      <div className='w-full flex flex-col lg:flex-row gap-12 items-center flex-wrap justify-center relative md:px-12'>
        <PrevArrow handleClick={() => setFrameNum(1)} />
        {preApprovals.map(option => {
          const isSelected = option.value === buyingWizardForm.preApproval
          return (
            <div
              key={option.value}
              className={`transition duration-500 w-[300px] h-[100px] border-2 border-black items-center justify-center rounded-xl flex flex-col gap-4 ${isSelected ? 'cursor-default text-white bg-black' : 'cursor-pointer hover:opacity-50'}`}
              onClick={() => updateApproval(option.value)}
            >
              <p className='font-bold tracking-tight text-xl text-center px-4'>{option.label}</p>
            </div>
          )
        })}
      </div>
    </div>
  )

  const renderContact = () => {
    if (!widgetURL) return <></>
    return (
      <div className='w-[100vw] max-w-[1200px] flex flex-col justify-center items-center'>
        <h2 className='font-bold tracking-tight text-2xl lg:text-4xl text-center'>Thanks! Let&#39;s book a meeting</h2>

        <iframe src={widgetURL} width='98%' height={1000} />
      </div>
    )
  }

  const handlePrev = () => {
    if (frameNum > 0) setFrameNum(frameNum - 1)
  }

  const handleNext = () => {
    if (frameNum < 2) setFrameNum(frameNum + 1)
  }

  if (frameNum === 3) return renderContact()
  return (
    <div className='w-full shadow-2xl p-4 lg:p-8 flex flex-col items-center min-h-96 w-[90vw] lg:w-[1000px] bg-white'>
      <div className='flex items-center justify-center w-full mb-8'>
        <img src='/chevron-left.png' onClick={handlePrev} className={`${frameNum === 0 ? 'opacity-50' : 'cursor-pointer'} mr-4 h-8 w-8 hidden md:block`} />
        <p onClick={() => handleChangeFrame(0)} className={`mr-1 font-semibold tracking-tight ${frameNum === 0 ? 'text-primary cursor-default' : 'cursor-pointer'}`}>TIMEFRAME</p>
        {buyingWizardForm.timeframe && <img src='/check-primary.png' height={12} width={12} />}
        <p onClick={() => handleChangeFrame(1)} className={`ml-2 mr-1 lg:ml-6 font-semibold tracking-tight ${frameNum === 1 ? 'text-primary cursor-default' : 'cursor-pointer'}`}>BUDGET</p>
        {buyingWizardForm.budget && <img src='/check-primary.png' height={12} width={12} />}
        <p onClick={() => handleChangeFrame(2)} className={`ml-2 mr-1 lg:ml-6 font-semibold tracking-tight ${frameNum === 2 ? 'text-primary cursor-default' : 'cursor-pointer'}`}>PRE-APPROVAL</p>
        {buyingWizardForm.preApproval && <img src='/check-primary.png' height={12} width={12} />}
        <img src='/chevron-right.png' onClick={handleNext} className={`${frameNum === 2 ? 'opacity-50' : 'cursor-pointer'} ml-4 h-8 w-8 hidden md:block`} />
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
      { frameNum === 0 && renderTimeframes() }
      { frameNum === 1 && renderBudgets() }
      { frameNum === 2 && renderPreapprovals() }
      <div className='md:hidden flex items-center justify-between w-full my-8'>
        <div onClick={handlePrev} className={`${frameNum === 0 ? 'opacity-50' : 'cursor-pointer'} flex items-center`}>
          <img src='/chevron-left.png' className='mr-2 h-6 w-6' />
          <p>Previous</p>
        </div>
        <div onClick={handleNext} className={`${frameNum === 2 ? 'opacity-50' : 'cursor-pointer'} flex items-center`}>
          <p>Next</p>
          <img src='/chevron-right.png' className='ml-2 h-6 w-6' />
        </div>
      </div>
    </div>
  )
}

export default BuyingWizard
