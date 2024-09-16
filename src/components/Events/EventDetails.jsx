import { Link, Outlet, useParams } from 'react-router-dom';

import Header from '../Header.jsx';
import { useQuery } from '@tanstack/react-query';
import { fetchEvent } from '../../utils/http.js';
import ErrorBlock from '../UI/ErrorBlock.jsx';
import LoadingIndicator from '../UI/LoadingIndicator.jsx';

export default function EventDetails() {
  const params = useParams();

  const { data, isPending, isError, error } = useQuery({
    queryKey: ['event', { eventId: params.id }],
    queryFn: ({ signal }) => fetchEvent({ signal, id: params.id })
  });

  return (
    <>
      <Outlet />
      <Header>
        <Link to="/events" className="nav-item">
          View all Events
        </Link>
      </Header>
      <article id="event-details">
        {isError && (
          <ErrorBlock
            title="Could not fetch event details"
            message={
              error.info?.message ||
              "No info available"
            }
          />)}
        {isPending && (<p style={{ textAlign: 'center' }}><LoadingIndicator /></p>)}
        {!isPending && data && (
          <>
            <header>
              <h1>{data.title}</h1>
              <nav>
                <button>Delete</button>
                <Link to="edit">Edit</Link>
              </nav>
            </header>
            <div id="event-details-content">
              <img src={`http://localhost:3000/${data.image}`} alt={data.title} />
              <div id="event-details-info">
                <div>
                  <p id="event-details-location">{data.location}</p>
                  <time dateTime={`Todo-DateT$Todo-Time`}>{data.date} @ {data.time}</time>
                </div>
                <p id="event-details-description">{data.description}</p>
              </div>
            </div>
          </>
        )}

      </article>
    </>
  );
}
