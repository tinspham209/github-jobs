import React, { useState } from "react";
import "./App.css";
import { useFetchJobs } from "./hooks/useFetchJob";
import { Container } from "react-bootstrap";
import Job from "./components/Job";
import Pagination from "./components/Pagination";
import Spinner from "./components/UI/Spinner";
import SearchForm from "./components/SearchForm";
const App = () => {
	const [params, setParams] = useState({});
	const [page, setPage] = useState(1);
	const { jobs, loading, error, hasNextPage } = useFetchJobs(params, page);

	const handleParamChange = (e) => {
		const param = e.target.name;
		const value = e.target.value;
		setPage(1);
		setParams((prevParams) => {
			return { ...prevParams, [param]: value };
		});
	};

	return (
		<Container className="my-4">
			<h1 className="mb-4">Github Jobs</h1>
			<SearchForm params={params} onParamChange={handleParamChange} />
			<Pagination page={page} setPage={setPage} hasNextPage={hasNextPage} />
			{loading && <Spinner />}
			{error && <h1>Error. Try Refreshing.</h1>}
			{jobs.map((job) => {
				return <Job key={job.id} job={job} />;
			})}
			<Pagination page={page} setPage={setPage} hasNextPage={hasNextPage} />
		</Container>
	);
};

export default App;
