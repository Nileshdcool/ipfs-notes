import Head from "next/head";
import { useState } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.css";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";
import InputGroup from "react-bootstrap/InputGroup";
import FormControl from "react-bootstrap/FormControl";
import ListGroup from "react-bootstrap/ListGroup";
import toast, { Toaster } from 'react-hot-toast';
import { ModalBody, ModalDialog, ModalFooter, ModalHeader, ModalTitle } from "react-bootstrap";


export default function Home() {
  const [loading, setLoading] = useState(false);
  const [requestLoad, setrequestLoad] = useState(false);
  const [note, setNote] = useState<any>([]);
  const [txt, setTxt] = useState("");

  const handleLoad = async () => {
    try {
      setrequestLoad(true);
      setLoading(true);
      const { data } = await axios.get("/api/ipfs");
      setNote(data);
      setLoading(false);
      toast.success('Data loaded successfully!');
    } catch (error) {
      console.log(error);
      toast.error('Something went wrong');
    }
  };
  const saveNotes = async () => {
    try {
      debugger;
      setLoading(true);
      const { data } = await axios.post("/api/ipfs", { txt });

      console.log(data);

      if (!data) {
        toast.error('This notes is already present');
        return;
      }
      setTxt('');
      console.log(data);
      setLoading(false);
      toast.success('Notes Saved Successfully!');
    } catch (error) {
      console.log(error);
      toast.error('Something went wrong');
    }
  };

  const handlleChange = (e: any) => {
    setTxt(e.target.value);
  }
  return (
    <>
      <Head>
        <title>IPFS Notes</title>
        <meta name="description" content="IPFS Notes" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Container>
        <Toaster
          position="top-right"
          reverseOrder={false}
        />
        <div
          className="modal show"
          style={{ display: 'block', position: 'initial' }}
        > 
        </div>
        <Row
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            fontSize: "3rem",
            fontWeight: "bolder",
          }}
        >
          IPFS Notes
        </Row>
        <hr />
        <Row>
          <Col md={{ span: 6, offset: 4 }}>
            <InputGroup className="mb-3">
              <FormControl
                style={{ marginBottom: '10px' }}
                placeholder="add note . . . "
                size="lg"
                onChange={handlleChange}
                value={txt}
                aria-label="add something"
                aria-describedby="basic-addon2"
              />

              <Button
                variant="dark"
                className=""
                onClick={handleLoad}
              >
                Refresh
              </Button>
              <InputGroup>
                <Button
                  variant="dark"
                  className="mt-2"
                  onClick={saveNotes}
                >
                  ADD
                </Button>
              </InputGroup>
            </InputGroup>
          </Col>
        </Row>
        {requestLoad && <Row>
          <Col md={{ span: 6, offset: 4 }}>
            <ListGroup>
              {/* map over and print items */}
              {note.map((item: any, index: any) => {
                return (
                  <div key={index} >
                    <ListGroup.Item
                      variant="dark"
                      action
                      style={{
                        display: "flex",
                        justifyContent: 'space-between'
                      }}
                    >
                      cid: {item.cid} content: {item.content}

                    </ListGroup.Item>
                  </div>
                );
              })}
            </ListGroup>
            <InputGroup>
              <Button
                variant="dark"
                className="mt-2"
                onClick={handleLoad}
              >
                {loading ? "Loading..." : "Load More"}
              </Button>
            </InputGroup>
          </Col>
        </Row>}

      </Container>
    </>
  );
}
