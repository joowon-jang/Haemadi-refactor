import Button from '@/components/Button/Button';
import { useMediaStore } from '@/stores/mediaStore';
import { setStorage } from '@/utils/storage';
import { useCallback, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import styles from './DemoPage.module.css';
import Step1Content from './components/StepContents/Step1Content';
import Step2Content from './components/StepContents/Step2Content';
import Step2to2Content from './components/StepContents/Step2to2Content';
import Step3Content from './components/StepContents/Step3Content';
import StepIndicator from './components/StepIndicator/StepIndicator';

function DemoPage() {
  const desktop = useMediaStore((store) => store.desktop);
  const navigate = useNavigate();
  const { step } = useParams();
  const [buttonState, setButtonState] = useState('disabled');
  const [selectedEmotion, setSelectedEmotion] = useState(null);

  const handleChange = useCallback((value) => {
    setSelectedEmotion(value);
  }, []);

  useEffect(() => {
    setButtonState(step !== '2' || selectedEmotion ? 'default' : 'disabled');
  }, [step, selectedEmotion]);
  useEffect(() => {
    if (step === '2') setSelectedEmotion(null);
  }, [step]);

  const renderContent = () => {
    switch (step) {
      default:
      case '1':
        return <Step1Content />;
      case '2':
        return <Step2Content handleSelect={handleChange} />;
      case '2-2':
        return <Step2to2Content selectedEmotion={selectedEmotion} />;
      case '3':
        return <Step3Content />;
    }
  };

  const handleNextClick = useCallback(() => {
    switch (step) {
      default:
      case '1':
        navigate('/demo/2');
        break;
      case '2':
        navigate('/demo/2-2');
        break;
      case '2-2':
        navigate('/demo/3');
        break;
      case '3':
        setStorage('completeDemo', true);
        navigate('/auth');
        break;
    }
  }, [navigate, step]);

  return (
    <div
      className={styles.pageContainer}
      style={{
        backgroundImage: `url(/demoPage/demoPage_step${step.slice(0, 1)}Bg.webp)`,
        backgroundPositionX: !desktop && step.slice(0, 1) === '2' ? '80%' : '',
      }}
    >
      {renderContent()}
      <div className={styles.buttonWrapper}>
        <Button type="normal" state={buttonState} onClick={handleNextClick}>
          다음으로
        </Button>
        <StepIndicator step={step.slice(0, 1)} />
      </div>
    </div>
  );
}

export default DemoPage;
