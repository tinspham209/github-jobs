import { useReducer, useEffect } from "react";
import axios from "axios";
export const ACTIONS = {
	MAKE_REQUEST: "make-request",
	GET_DATA: "get-data",
	ERROR: "error",
	UPDATE_HAS_NEXT_PAGE: "update-has-next-page",
};

const CORS_URL = "https://cors-anywhere.herokuapp.com";

const BASE_URL = `${CORS_URL}/https://jobs.github.com/positions.json`;

const reducer = (state, action) => {
	switch (action.type) {
		case ACTIONS.MAKE_REQUEST:
			return { loading: true, jobs: [] };
		case ACTIONS.GET_DATA:
			return { ...state, loading: false, jobs: action.payload.jobs };
		case ACTIONS.ERROR:
			return {
				...state,
				loading: false,
				error: action.payload.error,
				jobs: [],
			};
		case ACTIONS.UPDATE_HAS_NEXT_PAGE:
			return { ...state, hasNextPage: action.payload.hasNextPage };
		default:
			return state;
	}
};

export const useFetchJobs = (params, page) => {
	const [state, dispatch] = useReducer(reducer, { jobs: [], loading: true });

	useEffect(() => {
		const cancelTokenCurrentPage = axios.CancelToken.source();
		dispatch({ type: ACTIONS.MAKE_REQUEST });

		axios
			.get(BASE_URL, {
				cancelToken: cancelTokenCurrentPage.token,
				params: { markdown: true, page: page, ...params },
			})
			.then((res) => {
				dispatch({ type: ACTIONS.GET_DATA, payload: { jobs: res.data } });
			})
			.catch((error) => {
				if (axios.isCancel(error)) {
					return;
				}
				dispatch({ type: ACTIONS.ERROR, payload: { error: error } });
			});
		const cancelTokenNextPage = axios.CancelToken.source();
		axios
			.get(BASE_URL, {
				cancelToken: cancelTokenNextPage.token,
				params: { markdown: true, page: page + 1, ...params },
			})
			.then((res) => {
				dispatch({
					type: ACTIONS.UPDATE_HAS_NEXT_PAGE,
					payload: { hasNextPage: res.data.length !== 0 },
				});
			})
			.catch((error) => {
				if (axios.isCancel(error)) {
					return;
				}
				dispatch({ type: ACTIONS.ERROR, payload: { error: error } });
			});
		return () => {
			cancelTokenCurrentPage.cancel();
			cancelTokenNextPage.cancel();
		};
	}, [params, page]);

	return state;
};
