/* eslint-disable @typescript-eslint/no-empty-function */
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

import { Container } from '@mui/system';
import { Typography } from '@mui/material';
import { Grid } from '@mui/material';
import Box from '@mui/material/Box';
import { red } from '@mui/material/colors';

import Card from '@mui/material/Card';
import CardCover from '@mui/joy/CardCover';
import CardMedia from '@mui/material/CardMedia';
import Checkbox from '@mui/material/Checkbox';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import { Modal } from '@mui/material';
import IconButton from '@mui/material/IconButton';

import Backdrop from '@mui/material/Backdrop';

import dayjs from 'dayjs';
import axios from 'axios';
import styled from 'styled-components';

import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrashAlt } from '@fortawesome/free-regular-svg-icons';
import CloseIcon from '@mui/icons-material/Close';

import config from '../../config';
import { ALBUM_CREATE_REQUEST, CARD_LIST_LOADING_REQUEST } from '../../redux/types';
import Share from '../Album/Share';
import VideoDelete from './VideoDelete';
import { useDispatch, useSelector } from 'react-redux';
import IndeterminateCheckbox from './CheckBox';
import MainLayout from '../../components/MainLayout/MainLayout';

const CheckboxStyle = styled.div`
    position: absolute;
    top: 0px;
    right: 0px;
`;

const ClearCard = styled.div`
    background-position: center;
    background-size: cover;
    width: 100%;
    height: 100%;
    background: rgba(255, 255, 255, 0.2);
    box-shadow: 0 1rem 2rem rgba(0, 0, 0, 0.3);
    text-align: center;
    border-radius: 1rem;
`;

const Video = () => {
    const [offset, setOffset] = useState(0);
    const dispatch = useDispatch();
    const { cardList } = useSelector((state: any) => state.cardList);

    useEffect(() => {
        dispatch({
            type: CARD_LIST_LOADING_REQUEST,
            payload: offset,
        });
    }, [dispatch, offset]);

    useEffect(() => {
        const handleScroll = (e: any) => {
            const scrollHeight = e.target.documentElement.scrollHeight;
            const currentHeight = e.target.documentElement.scrollTop + window.innerHeight;

            if (currentHeight + 1 >= scrollHeight) {
                setOffset(offset + 1);
            }
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, [offset]);

    const label = { inputProps: { 'aria-label': 'Checkbox demo' } };

    const [checkedListAlbum, setCheckedListAlbum]: any = useState([]);
    // 체크시 데이터 저장, 체크 해제시 데이터 삭제
    const onCheckedElement = (checked: boolean, item: any) => {
        if (checked) {
            checkedListAlbum.push(item); // CHECK
            setCheckedListAlbum([...checkedListAlbum]);
        } else if (!checked) {
            onRemoveChecked(item);
        }
    };

    const [titleInput, setTitleInput]: any = useState('');

    const onKeyPress = (e: any) => {
        if (e.key == 'Enter') {
            alert('title이 저장되었습니다.');
        }
    };

    // 체크 해제 데이터 삭제
    const onRemoveChecked = (item: any) => {
        // delete checkedListAlbum[item.cardId];
        setCheckedListAlbum(checkedListAlbum.filter((card: any) => card.cardId !== item.cardId));
    };
    const [id, setId] = useState('');

    const [thumbnailUrl, setThumbnamilUrl] = useState('');
    const [videoUrl, setVideoUrl] = useState('');
    const [open, setOpen] = React.useState(false);
    const [comment, setComment] = useState('');

    const handleClose = () => {
        setOpen(false);
    };

    return (
        <MainLayout>
            <Container maxWidth="lg">
                <Typography sx={{ fontSize: '20px', fontWeight: 'bold', p: '4px 0px', mt: '20px', mb: '20px', color: 'var(--white)' }}>
                    Video
                </Typography>
                <ClearCard>
                    <Box
                        sx={{
                            display: 'flex',
                            justifyContent: 'center',
                            alignContent: 'center',
                            borderRadius: '6px',
                        }}
                    >
                        <Accordion style={{ backgroundColor: '#525252', flex: '1' }}>
                            <AccordionSummary
                                expandIcon={<ExpandMoreIcon sx={{ color: 'var(--white)' }} />}
                                aria-controls="panel1a-content"
                                id="panel1a-header"
                            >
                                <Typography sx={{ color: 'var(--white)' }}>앨범에 추가할 비디오 확인하기</Typography>
                            </AccordionSummary>
                            <AccordionDetails>
                                <Typography sx={{ color: '#a1a1aa', fontSize: '15px', textAlign: 'left', p: 1 }}>
                                    처음 선택한 비디오의 썸네일이 앨범의 표지가 됩니다.
                                </Typography>
                                <ClearCard>
                                    <Typography
                                        style={{
                                            display: 'flex',
                                            padding: '10px',
                                            overflow: 'auto',
                                            flexDirection: 'row',
                                            position: 'relative',
                                        }}
                                    >
                                        {checkedListAlbum.length === 0 && (
                                            <div style={{ color: '#a1a1aa', textAlign: 'center', marginBottom: '10px' }}>
                                                {'선택한 비디오가 없습니다'}
                                            </div>
                                        )}
                                        {checkedListAlbum.map((list: any) => {
                                            return (
                                                <div key={list}>
                                                    <Card
                                                        sx={{
                                                            display: 'flex',
                                                            justifyContent: 'center',
                                                            alignContent: 'center',
                                                            flexDirection: 'column',
                                                            margin: '10px',
                                                        }}
                                                    >
                                                        <div style={{ marginBottom: '10px' }}>
                                                            <img
                                                                src={`https://${config.aws.bucket_name}.s3.${config.aws.region}.amazonaws.com/${list.thumbnailUrl}`}
                                                                style={{
                                                                    width: '170px',
                                                                    height: '120px',
                                                                }}
                                                            />
                                                            {/* <span style={{ display: 'none' }}>{list}</span> */}
                                                        </div>
                                                        <FontAwesomeIcon
                                                            onClick={() => onRemoveChecked(list)}
                                                            icon={faTrashAlt}
                                                            size="sm"
                                                            style={{ color: 'grey', cursor: 'pointer', marginBottom: '5px' }}
                                                        />
                                                    </Card>
                                                </div>
                                            );
                                        })}
                                    </Typography>
                                </ClearCard>
                            </AccordionDetails>
                            <Box sx={{ display: 'flex', justifyContent: 'center', alignContent: 'center' }}>
                                <input
                                    type="text"
                                    style={{
                                        outline: 'none',
                                        borderRadius: '3px',
                                        border: '1.5px thin #221718',
                                        fontSize: '16px',
                                        boxShadow: '3px 3px 1px lightgray',
                                        paddingLeft: '10px',
                                        marginBottom: '20px',
                                        width: '400px',
                                        textAlign: 'center',
                                        marginRight: '10px',
                                        backgroundColor: '#F1F5F9',
                                    }}
                                    placeholder="앨범의 title을 입력하세요."
                                    onChange={(e) => {
                                        setTitleInput(e.target.value);
                                    }}
                                    onKeyDown={onKeyPress}
                                ></input>

                                <button
                                    type="button"
                                    style={{
                                        outline: 'none',
                                        borderRadius: '3px',
                                        border: '0.1px thin black',
                                        fontSize: '16px',
                                        boxShadow: '3px 3px 1px lightgray',
                                        paddingLeft: '10px',
                                        paddingRight: '10px',
                                        marginBottom: '20px',
                                        textAlign: 'center',
                                    }}
                                    onClick={() => {
                                        console.log(checkedListAlbum.map((row: any) => row.cardId));
                                        dispatch({
                                            type: ALBUM_CREATE_REQUEST,
                                            payload: {
                                                title: titleInput,
                                                card_id: checkedListAlbum.map((row: any) => row.cardId),
                                                cover_img_url: checkedListAlbum[0].thumbnailUrl,
                                            },
                                        });
                                        alert('앨범이 생성되었습니다.');
                                        history.go(0);
                                    }}
                                >
                                    앨범 만들기
                                </button>
                            </Box>
                        </Accordion>
                    </Box>
                </ClearCard>
                <ClearCard>
                    <IndeterminateCheckbox />
                </ClearCard>
                <Grid container spacing={1} sx={{ mt: '20px' }}>
                    {cardList?.map((card: any) => (
                        <Grid item key={card.cardId} xs={12} sm={4}>
                            <Link to={`/video/${card.cardId}`}>
                                <Card
                                    sx={{ height: '100%', display: 'flex', flexDirection: 'column', position: 'relative', borderRadius: '0px' }}
                                    onMouseOver={() => {
                                        const hz: HTMLVideoElement = document.getElementById(String(card.cardId)) as HTMLVideoElement;

                                        const playPromise = hz.play();
                                        if (playPromise !== undefined) {
                                            // eslint-disable-next-line @typescript-eslint/no-unused-vars
                                            playPromise.then((_: any) => {}).catch((error: any) => {});
                                        }
                                    }}
                                    onMouseOut={() => {
                                        const hz: HTMLVideoElement = document.getElementById(String(card.cardId)) as HTMLVideoElement;
                                        hz.load();
                                    }}
                                    onClick={() => {
                                        setId(card.cardId);
                                        setVideoUrl(card.videoUrl);
                                        setThumbnamilUrl(card.thumbnailUrl);
                                        setOpen(true);
                                        setComment(card.commnet);
                                    }}
                                >
                                    <CardCover
                                    // sx={{
                                    //     background:
                                    //         'linear-gradient(to top, rgba(0,0,0,0.4), rgba(0,0,0,0) 200px), linear-gradient(to top, rgba(0,0,0,0.8), rgba(0,0,0,0) 300px)',
                                    // }}
                                    >
                                        {/* <video id={String(card)} loop poster="https://source.unsplash.com/random">
                                            <source src="https://assets.codepen.io/6093409/river.mp4" type="video/mp4" />
                                        </video> */}
                                        <video
                                            id={String(card.cardId)}
                                            loop
                                            muted
                                            poster={`https://${config.aws.bucket_name}.s3.${config.aws.region}.amazonaws.com/${card.thumbnailUrl}`}
                                        >
                                            <source
                                                src={`https://${config.aws.bucket_name}.s3.${config.aws.region}.amazonaws.com/${card.videoUrl}`}
                                                type="video/webm"
                                            />
                                        </video>
                                    </CardCover>
                                    <CardCover
                                        sx={{
                                            background:
                                                'linear-gradient(to top, rgba(0,0,0,0.4), rgba(0,0,0,0) 100px), linear-gradient(to top, rgba(0,0,0,0.6), rgba(0,0,0,0) 200px)',
                                        }}
                                    />
                                    <CheckboxStyle>
                                        <Checkbox
                                            onClick={(e) => e.stopPropagation()}
                                            value={card.cardId}
                                            checked={checkedListAlbum.find((e: any) => e.cardId === card.cardId) !== undefined ? true : false}
                                            onChange={(event) => onCheckedElement(event.target.checked, card)}
                                            {...label}
                                            sx={{
                                                color: '#f42E66',
                                                '&.Mui-checked': {
                                                    color: '#f42E66',
                                                },
                                            }}
                                            // 하트
                                            // icon={<FavoriteBorder sx={{fontSize:'40px'}}/>}
                                            // checkedIcon={<Favorite sx={{fontSize:'40px'}} />}
                                            // 책갈피
                                            icon={<BookmarkBorderIcon sx={{ fontSize: '40px' }} />}
                                            checkedIcon={<BookmarkIcon sx={{ fontSize: '40px' }} />}
                                        />
                                    </CheckboxStyle>
                                    <CardMedia
                                        component="img"
                                        sx={{
                                            // 16:9
                                            width: '120',
                                            height: '250px',
                                            objectFit: 'fill',
                                        }}
                                        image="./imgs/not_found_files.jpg"
                                        alt="img"
                                    />
                                    <Box
                                        sx={{
                                            bottom: '0%',
                                            width: '100%',
                                            textAlign: 'center',
                                            position: 'absolute',
                                            color: 'white',
                                        }}
                                    >
                                        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                            <Typography mt={5} ml={1} fontSize={15} color="#d1d5db">
                                                {dayjs(card.createdAt).tz('utc').format('YYYY.MM.DD HH:mm')}
                                            </Typography>
                                            <Typography mr={1} mt={2} variant="h5" component="h2">
                                                {card.expressionLabel}
                                            </Typography>
                                        </Box>
                                    </Box>
                                </Card>
                            </Link>
                        </Grid>
                    ))}
                </Grid>
                {/* <Container style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    <Modal open={open} onClose={handleClose}>
                        <Box
                            sx={{
                                top: '50%',
                                left: '50%',
                                transform: 'translate(-50%, -50%)',
                                position: 'absolute',
                                outline: 'none',
                                display: 'flex',
                                flexDirection: 'row',
                            }}
                        >
                            <video
                                controls
                                autoPlay
                                loop
                                poster={`https://${config.aws.bucket_name}.s3.${config.aws.region}.amazonaws.com/${thumbnailUrl}`}
                            >
                                <source
                                    src={`https://${config.aws.bucket_name}.s3.${config.aws.region}.amazonaws.com/${videoUrl}`}
                                    type="video/webm"
                                />
                            </video>
                            <Box>
                                <IconButton type="button" onClick={handleClose}>
                                    <CloseIcon sx={{ color: 'white' }} />
                                </IconButton>
                                <Share img={thumbnailUrl} comment={comment} videoUrl={videoUrl} />
                                <VideoDelete cardId={id} />
                            </Box>
                        </Box>
                    </Modal>
                </Container> */}
            </Container>
        </MainLayout>
    );
};

export default Video;
