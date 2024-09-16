import { Link, Outlet, useNavigate, useParams } from 'react-router-dom';

import Header from '../Header.jsx';
import { useMutation, useQuery } from '@tanstack/react-query';
import { queryClient, fetchEvent, deleteEvent } from '../../utils/http.js';
import ErrorBlock from '../UI/ErrorBlock.jsx';
import LoadingIndicator from '../UI/LoadingIndicator.jsx';
import { useState } from 'react';
import Modal from '../UI/Modal.jsx';

export default function EventDetails() {
  const [isDeleting, setIsDeleting] = useState(false);
  const params = useParams();
  const navigate = useNavigate();

  const { data, isPending, isError, error } = useQuery({
    queryKey: ['event', { eventId: params.id }],
    queryFn: ({ signal }) => fetchEvent({ signal, id: params.id })
  });

  const {
    mutate,
    isPending: isPendingDeletion,
    isError: isErrorDeletion,
    error: errorDeletion
  } = useMutation({
    mutationFn: deleteEvent,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['events'],
        refetchType: 'none',
      });
      navigate('/events');
    },
    onError: (meta) => console.log(meta)
  });

  function handleStartDelete() {
    setIsDeleting(true);
  }
  function handleStopDelete() {
    setIsDeleting(false);
  }

  function handleDeleteEvent() {
    mutate({ id: params.id });
  }

  return (
    <>
      {isDeleting && (
        <Modal onClose={handleStopDelete}>
          <h2>Are you sure ?</h2>
          <p>
            Do you really want to delete this event? This action cannot be undone.
          </p>
          <div className='form-actions'>
            {isPendingDeletion && (
              <p>Deleting, please wait...</p>
            )}
            {!isPendingDeletion && (
              <>
                <button onClick={handleStopDelete} className='button-text'>Cancel</button>
                <button onClick={handleDeleteEvent} className='button'>Delete</button>
              </>
            )}
          </div>
          {isErrorDeletion && (
            <ErrorBlock
              title="Failed to delete event"
              message={
                errorDeletion.info?.message ||
                "Failed to delete event, please try again later."
              } />
          )}
        </Modal>
      )}

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

        {isPending && (
          <div style={{ textAlign: 'center' }}>
            <LoadingIndicator />
          </div>
        )}

        {!isPending && data && (
          <>
            <header>
              <h1>{data.title}</h1>
              <nav>
                <button onClick={handleStartDelete}>Delete</button>
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
