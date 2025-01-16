import { useRef, useEffect, memo, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMediaQuery } from 'react-responsive';
import { Helmet } from 'react-helmet-async';
import { useQuery } from '@tanstack/react-query';

import styles from './LetterBoxPage.module.css';
import { readDiaries } from '@/api/diaries';
import { useAuthStore } from '@/stores/authStore';
import BackButton from '@/components/BackButton/BackButton';
import Button from '@/components/Button/Button';
import Loading from '@/components/Loading/Loading';

import { useToaster } from '@/stores/ToasterStore';

function LetterBoxPage() {
  const navigate = useNavigate();
  const desktop = useMediaQuery({ query: '(min-width: 960px)' });
  const userInfo = useAuthStore((store) => store.userInfo);
  const toast = useToaster();

  /* --------------------------------- 스타일 객체 --------------------------------- */
  const backButtonStyle = useMemo(
    () => ({
      position: 'absolute',
      top: desktop ? '8vh' : '24px',
      left: desktop ? 'calc(50vw - 130px)' : '40px',
    }),
    [desktop]
  );
  const buttonStyle = useMemo(
    () => ({
      marginTop: desktop ? '4.6vh' : '5.1vh',
    }),
    [desktop]
  );

  /* ----------------------------- REQUEST URL의 params 작성 ----------------------------- */
  const diariesParams = useMemo(
    () =>
      new URLSearchParams({
        // 일기 1개만 가져옴
        page: 1,
        perPage: 1,
        // 답장이 왔고 && 자신이 쓴 일기
        filter: `replyId!="" && userId="${userInfo.id}"`,
        // 가장 최근에 답장을 받은 일기
        sort: '-created',
        expand: 'replyId',
      }).toString(),
    [userInfo.id]
  );

  /* ------------------------------ 서버에 일기 목록 요청 ------------------------------ */
  const { data, error, isLoading } = useQuery({
    queryKey: ['diaries', diariesParams],
    queryFn: () => readDiaries(diariesParams),
  });

  const firstRun = useRef(true);
  useEffect(() => {
    if (firstRun.current) {
      firstRun.current = false;
      return;
    }

    if (data?.items.length === 0) {
      toast('warn', '아직 받은 답장이 없어요.');
      navigate('/');
    }
  }, [data?.items.length, navigate, toast]);

  if (isLoading) return <Loading />;
  if (error) return <div>{error.message}</div>;

  const diaryId = data.items[0]?.id;
  const replier = data.items[0]?.expand.replyId?.replier;

  const handleButtonClick = () => {
    navigate(`view-diary/${diaryId}`);
  };

  return (
    <div className={styles.page}>
      <Helmet>
        <title>편지함 - 해마디</title>
        <meta name="description" content="받은 편지를 확인해 보세요" />
        <meta property="og:title" content="편지함 - 해마디" />
        <meta property="og:description" content="받은 편지를 확인해 보세요" />
        <meta name="twitter:title" content="편지함 - 해마디" />
        <meta name="twitter:description" content="받은 편지를 확인해 보세요" />
      </Helmet>
      <div className={styles.pageContainer}>
        <header className={styles.header}>
          <BackButton color="white" style={backButtonStyle} />
          <h1>마디 유리병 편지함</h1>
        </header>

        <main className={styles.main}>
          <h2>{`${replier === 'ai' ? 'Ai 마디' : '익명의 누군가'}에게 받은\n유리병 편지함이에요`}</h2>
          <img
            src={`/glassBottle/glassBottle_${desktop ? 'selected' : 'center'}.webp`}
            alt="유리병"
            className={styles.glassBottle}
            loading="lazy"
          />
          <p>
            {replier === 'ai'
              ? '마디는 해마디의 Ai 서비스로\n작성한 편지를 분석해 답변해요'
              : '누군가 당신의 일기를 보고 답장했어요!'}
          </p>
          <Button role="button" style={buttonStyle} onClick={handleButtonClick}>
            보러 갈래요
          </Button>
        </main>
      </div>
    </div>
  );
}

export default memo(LetterBoxPage);
