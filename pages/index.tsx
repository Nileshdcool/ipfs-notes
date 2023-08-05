import Head from "next/head";
import Image from "next/image";
import { Inter } from "@next/font/google";
import { useEffect, useState } from "react";
import axios from "axios";
import { BasicIpfsData } from "./api/ipfs";
import "bootstrap/dist/css/bootstrap.css";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";
import InputGroup from "react-bootstrap/InputGroup";
import FormControl from "react-bootstrap/FormControl";
import ListGroup from "react-bootstrap/ListGroup";
const inter = Inter({ subsets: ["latin"] });


export default function Home() {
  const [loading, setLoading] = useState(false);
  const [requestLoad, setrequestLoad] = useState(false);
  const [result, setResult] = useState<BasicIpfsData | null>(null);

  const [note, setNote] = useState<any>([]);
  
  const [txt, setTxt] = useState("");

  const handleLoad = async () => {
    setrequestLoad(true);
    setLoading(true);
    const { data } = await axios.get("/api/ipfs");
    setResult(data);
    setLoading(false);
  };

  const saveNotes = async () => {
    setLoading(true);
    const { data } = await axios.post("/api/ipfs",{txt});
    setTxt('');
    console.log(data);
    setNote([...note,{cid:data.cid,content:data.content}]);
    setLoading(false);
  };

  const handlleChange = (e:any) => {
    setTxt(e.target.value);
  }
  // avoiding ternary operators for classes
  function classNames(...classes: any) {
    return classes.filter(Boolean).join(" ");
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
                    <Col md={{ span: 5, offset: 4 }}>
                        <InputGroup className="mb-3">
                            <FormControl
                                placeholder="add note . . . "
                                size="lg"
                                onChange={handlleChange}
                                value={txt}
                                aria-label="add something"
                                aria-describedby="basic-addon2"
                            />
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
                    <Col md={{ span: 5, offset: 4 }}>
                        <ListGroup>
                            {/* map over and print items */}
                            {note.map((item:any, index:any) => {
                                return (
                                  <div key = {index} > 
                                    <ListGroup.Item
                                        variant="dark"
                                        action
                                        style={{display:"flex",
                                                justifyContent:'space-between'
                                      }}
                                    >
                                        cid: {item.cid} content: {item.content}
                                        <span>
                                        </span>
                                    </ListGroup.Item>
                                  </div>
                                );
                            })}
                        </ListGroup>
                    </Col>
                </Row>}
            </Container>
    </>
  );
}
