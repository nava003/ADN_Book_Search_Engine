import {
  Container,
  Card,
  Button,
  Row,
  Col
} from 'react-bootstrap';
import Auth from '../utils/auth';
import { removeBookId } from '../utils/localStorage';
import { useQuery, useMutation } from '@apollo/client';
import { GET_ME } from '../utils/queries';
import { REMOVE_BOOK } from '../utils/mutations';

const SavedBooks = () => {
  const { loading, data } = useQuery(GET_ME);
  const userData = data?.me || data?.user || {};
  const [removeBook, { error }] = useMutation(REMOVE_BOOK);
  if(!userData?.username) {
    return (
      <h4>
        You need to be logged in to see this page! Use the navigation links to sign up or log in!
      </h4>
    )
  }

  // create function that accepts the book's mongo _id value as param and deletes the book from the database  
  const handleDeleteBook = async (bookId) => {
    const token = Auth.loggedIn() ? Auth.getToken() : null;

    if (!token) {
      return false;
    }

    try {
      await removeBook({
        variables: { bookId }
      });

      removeBookId(bookId);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <>
      <div fluid="true" className="text-light bg-dark p-5">
        <Container>
          <h1>Viewing saved books!</h1>
        </Container>
      </div>
      <Container>
        {loading ? (
          <div>Loading...</div>
        ) : (
          <>
            <h2 className='pt-5'>
              {userData.savedBooks.length
                ? `Viewing ${userData.savedBooks.length} saved ${userData.savedBooks.length === 1 ? 'book' : 'books'}:`
                : 'You have no saved books!'}
            </h2>
              <Row>
                {userData.savedBooks.map((book) => {
                  return (
                    <Col key={book.bookId} md="4">
                      <Card border='dark'>
                        {book.image ? <Card.Img src={book.image} alt={`The cover for ${book.title}`} variant='top' /> : null}
                        <Card.Body>
                          <Card.Title>{book.title}</Card.Title>
                          <p className='small'>Authors: {book.authors}</p>
                          <Card.Text>{book.description}</Card.Text>
                          <Button className='btn-block btn-danger' onClick={() => handleDeleteBook(book.bookId)}>
                            Delete this Book!
                          </Button>
                        </Card.Body>
                      </Card>
                    </Col>
                  );
                })}
              </Row>
          </>
        )}
      </Container>
      {error && <div>Something went wrong...</div>}
    </>
  );
};

export default SavedBooks;
