import Layout from "@/components/Layout";
import { useRouter } from "next/router";
import EventItem from "@/components/EventItem";
import { API_URL } from "@/config/index";
import QueryString from "qs";
import Link from "next/link";

export default function SearchPage({ events }) {
	const router = useRouter();

	return (
		<Layout title="Search Results">
			<h1>Search Results for {router.query.term}</h1>
			<Link href="/events">
				<a>{"<"} Go Back</a>
			</Link>
			{events.length === 0 && <h3>No events to show</h3>}
			{events.map((evt) => (
				<EventItem key={evt.id} evt={evt} />
			))}
		</Layout>
	);
}

export async function getServerSideProps({ query: { term } }) {
	const query = QueryString.stringify({
		_where: {
			_or: [
				{ name_contains: term },
				{ performers_contains: term },
				{ description_contains: term },
				{ venue_contains: term },
			],
		},
	});

	const res = await fetch(`${API_URL}/events?${query}`);
	const events = await res.json();

	return {
		props: { events },
	};
}
