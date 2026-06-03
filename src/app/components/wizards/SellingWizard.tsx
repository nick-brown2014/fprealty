'use client'

import { useEffect, useState } from "react"
import { SellingWizardOptions, WizardOption } from "@/app/types/WizardTypes"
import NextArrow from '@/app/components/wizards/NextArrow'
import PrevArrow from '@/app/components/wizards/PrevArrow'

const defaultSellingWizard: SellingWizardOptions = {
  timeframe: '',
  worth: '',
}

const timeframes: WizardOption[] = [
  { label: 'ASAP', value: 'ASAP'},
  { label: '3 months', value: '3 months' },
  { label: '3 - 6 months', value: '3 - 6 months' },
  { label: '6 - 12 months', value: '6 - 12 months' },
  { label: '12+ months', value: '12+ months' },
]

const worths: WizardOption[] = [
  { label: '350k to 500k', value: '350,000 - 500,000' },
  { label: '500k to 750k', value: '500,000 - 750,000' },
  { label: '750k to 1mil', value: '750,000 - 1,000,000' },
  { label: '1mil to 1.5mil', value: '1,000,000 - 1,500,000' },
  { label: '1.5mil to 2mil', value: '1,500,000 - 2,000,000' },
  { label: 'Over 2mil', value: 'Over 2,000,000' },
]


const SellingWizard = () => {
  const [sellingWizardForm, setSellingWizardForm] = useState<SellingWizardOptions>(defaultSellingWizard)
  const [widgetURL, setWidgetURL] = useState<string>('')
  const [frameNum, setFrameNum] = useState<number>(0)
  
  useEffect(() => {
    if (!!sellingWizardForm.timeframe && !!sellingWizardForm.worth) {
      setFrameNum(2)
      setWidgetURL(`https://link.myagenthq.com/widget/booking/yZhQLON11p3fe4O6Bupb?time=${sellingWizardForm.timeframe}&property_value=${sellingWizardForm.worth}`)
    }
  }, [sellingWizardForm])

  const handleChangeFrame = (newFrame: number) => {
    if (newFrame === frameNum) return
    setFrameNum(newFrame)
  }

  const updateTimeframe = (newTimeframe: string) => {
    const newWizardForm: SellingWizardOptions = {...sellingWizardForm, timeframe: newTimeframe}
    setSellingWizardForm(newWizardForm)
    setTimeout(() => {
      setFrameNum(1)
    }, 250)
  }

  const updateWorth = (newWorth: string) => {
    const newWizardForm: SellingWizardOptions = {...sellingWizardForm, worth: newWorth}
    setSellingWizardForm(newWizardForm)
    setTimeout(() => {
      setFrameNum(2)
    }, 250)
  }

  const renderTimeframes = () => (
    <div className='w-full flex flex-col gap-10 items-center'>
      <h3 className='font-serif font-bold tracking-tight text-2xl lg:text-[34px] leading-[1.15] text-center text-black'>When do you need to sell?</h3>
      <div className='w-full flex flex-row gap-3.5 items-stretch flex-wrap justify-center relative px-2'>
        <NextArrow handleClick={() => setFrameNum(1)} />
        {timeframes.map(option => {
          const isSelected = option.value === sellingWizardForm.timeframe
          return (
            <div
              key={option.value}
              className={`transition-all duration-300 w-[150px] h-[150px] border rounded-sm flex flex-col gap-3 items-center justify-center ${isSelected ? 'cursor-default text-white bg-primary border-primary' : 'cursor-pointer bg-white border-black/15 hover:border-primary hover:bg-primary/[0.04]'}`}
              onClick={() => updateTimeframe(option.value)}
            >
              <img src={`${isSelected ? '/timeframe-white.png' : '/timeframe.png'}`} height={42} width={42} />
              <p className='font-condensed font-bold tracking-[0.06em] uppercase text-[15px] text-center px-2'>{option.label}</p>
            </div>
          )
        })}
      </div>
    </div>
  )

  const renderWorths = () => (
    <div className='w-full flex flex-col gap-10 items-center'>
      <h3 className='font-serif font-bold tracking-tight text-2xl lg:text-[34px] leading-[1.15] text-center text-black'>What do you think your property is worth?</h3>
      <div className='w-full flex flex-row gap-3.5 items-stretch flex-wrap justify-center relative px-2'>
        <PrevArrow handleClick={() => setFrameNum(0)} />
        {worths.map(option => {
          const isSelected = option.value === sellingWizardForm.worth
          return (
            <div
              key={option.value}
              className={`transition-all duration-300 w-[150px] h-[150px] border rounded-sm flex flex-col gap-3 items-center justify-center ${isSelected ? 'cursor-default text-white bg-primary border-primary' : 'cursor-pointer bg-white border-black/15 hover:border-primary hover:bg-primary/[0.04]'}`}
              onClick={() => updateWorth(option.value)}
            >
              <img src={`${isSelected ? '/budget-white.png' : '/budget.png'}`} height={42} width={42} />
              <p className='font-condensed font-bold tracking-[0.06em] uppercase text-[15px] text-center px-2'>{option.label}</p>
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
        <h3 className='font-serif font-bold tracking-tight text-2xl lg:text-[34px] leading-[1.15] text-center text-black mb-6'>Thanks! Let&#39;s book a meeting.</h3>
        <iframe src={widgetURL} width='98%' height={1000} />
      </div>
    )
  }

  const handlePrev = () => {
    if (frameNum > 0) setFrameNum(frameNum - 1)
  }

  const handleNext = () => {
    if (frameNum < 1) setFrameNum(frameNum + 1)
  }

  const StepLabel = ({ index, label, hasCheck }: { index: number; label: string; hasCheck: boolean }) => {
    const active = frameNum === index
    return (
      <div
        onClick={() => handleChangeFrame(index)}
        className={`flex items-center gap-2 ${active ? 'cursor-default' : 'cursor-pointer'}`}
      >
        <span className={`font-condensed text-[11px] font-black tracking-[0.18em] uppercase ${active ? 'text-primary' : 'text-black/40 hover:text-black'}`}>
          {label}
        </span>
        {hasCheck && <img src='/check-primary.png' height={11} width={11} />}
      </div>
    )
  }

  if (frameNum === 2) return renderContact()
  return (
    <div className='w-full bg-white border border-black/10 p-6 lg:p-10 flex flex-col items-center min-h-96 w-[90vw] lg:w-[860px] shadow-[0_8px_40px_-12px_rgba(0,0,0,0.18)]'>
      {/* Stepper */}
      <div className='hidden md:flex items-center justify-center w-full mb-10 gap-5'>
        <img src='/chevron-left.png' onClick={handlePrev} className={`${frameNum === 0 ? 'opacity-30 cursor-default' : 'cursor-pointer hover:opacity-70'} h-5 w-5 transition-opacity`} />
        <StepLabel index={0} label='Timeframe' hasCheck={!!sellingWizardForm.timeframe} />
        <span className='block w-8 h-px bg-black/20' />
        <StepLabel index={1} label='Value' hasCheck={!!sellingWizardForm.worth} />
        <img src='/chevron-right.png' onClick={handleNext} className={`${frameNum === 1 ? 'opacity-30 cursor-default' : 'cursor-pointer hover:opacity-70'} h-5 w-5 transition-opacity`} />
      </div>
      <div className='md:hidden flex items-center justify-between w-full mb-8'>
        <div onClick={handlePrev} className={`${frameNum === 0 ? 'opacity-30' : 'cursor-pointer'} flex items-center gap-1.5`}>
          <img src='/chevron-left.png' className='h-5 w-5' />
          <p className='font-condensed text-[11px] font-black tracking-[0.16em] uppercase'>Prev</p>
        </div>
        <div className='flex items-center gap-3'>
          <StepLabel index={0} label='Time' hasCheck={!!sellingWizardForm.timeframe} />
          <span className='block w-4 h-px bg-black/20' />
          <StepLabel index={1} label='Value' hasCheck={!!sellingWizardForm.worth} />
        </div>
        <div onClick={handleNext} className={`${frameNum === 1 ? 'opacity-30' : 'cursor-pointer'} flex items-center gap-1.5`}>
          <p className='font-condensed text-[11px] font-black tracking-[0.16em] uppercase'>Next</p>
          <img src='/chevron-right.png' className='h-5 w-5' />
        </div>
      </div>
      { frameNum === 0 && renderTimeframes() }
      { frameNum === 1 && renderWorths() }
    </div>
  )
}

export default SellingWizard
