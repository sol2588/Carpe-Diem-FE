import config from '../../config';
import axios from 'axios';
import { all, call, put, takeEvery, fork } from 'redux-saga/effects';
import {
    USER_LOADING_REQUEST,
    USER_LOADING_SUCCESS,
    USER_LOADING_FAILURE,
    USIM_LOADING_REQUEST,
    USIM_LOADING_SUCCESS,
    USIM_LOADING_FAILURE,
    USIM_CREATE_REQUEST,
    USIM_CREATE_SUCCESS,
    USIM_CREATE_FAILURE,
} from '../types';

// User Loading
const userLoadingAPI = (token: any) => {
    return axios({
        method: 'get',
        url: `http://${config.server.host}:${config.server.port}/auth`,
        withCredentials: true,
        headers: {
            'Content-Type': 'application/json',
        },
    });
};

function* userLoading(action: any): any {
    try {
        const result = yield call(userLoadingAPI, action.payload);
        console.log('유저 정보', result.data);
        yield put({
            type: USER_LOADING_SUCCESS,
            payload: result.data,
        });
        console.log('유저 로딩');
    } catch (e: any) {
        console.log('유저 로딩 실패');
        yield put({
            type: USER_LOADING_FAILURE,
            payload: e.response,
        });
    }
}

function* watchUserLoading() {
    yield takeEvery(USER_LOADING_REQUEST, userLoading);
}

// Usim Loading
const usimLoadingAPI = (data: any) => {
    return axios({
        method: 'get',
        url: `http://${config.server.host}:${config.server.port}/camera/usim`,
        withCredentials: true,
        headers: {
            'Content-Type': 'application/json',
        },
    });
};

function* usimLoading(action: any): any {
    try {
        const result = yield call(usimLoadingAPI, action.payload);
        const usimData: string[] = [];
        Object.values(result.data).map((value: any) => {
            usimData.push(`https://${config.aws.bucket_name}.s3.${config.aws.region}.amazonaws.com/${value.userImgUrl}`);
        });

        yield put({
            type: USIM_LOADING_SUCCESS,
            payload: usimData,
        });
    } catch (e: any) {
        yield put({
            type: USIM_LOADING_FAILURE,
            payload: e.response,
        });
    }
}

function* watchUsimLoading() {
    yield takeEvery(USIM_LOADING_REQUEST, usimLoading);
}

// Usim Create
const usimCreateAPI = (data: any) => {
    console.log(data);
    return axios({
        method: 'post',
        url: `http://${config.server.host}:${config.server.port}/camera/usim`,
        withCredentials: true,
        data: data,
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
};

function* usimCreate(action: any): any {
    try {
        const result = yield call(usimCreateAPI, action.payload);
        console.log('usim 생성', result.data);
        yield put({
            type: USIM_CREATE_SUCCESS,
            payload: result.data,
        });
    } catch (e: any) {
        yield put({
            type: USIM_CREATE_FAILURE,
            payload: e.response,
        });
    }
}

function* watchUsimCreate() {
    yield takeEvery(USIM_CREATE_REQUEST, usimCreate);
}

function* authSaga() {
    yield all([fork(watchUserLoading)]);
}

function* usimSaga() {
    yield all([fork(watchUsimLoading), fork(watchUsimCreate)]);
}

export { authSaga, usimSaga };