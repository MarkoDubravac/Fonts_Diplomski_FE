import React, { useState } from "react";
import Form from "react-bootstrap/Form";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import { request } from "../axios_helper";
import { useNavigate } from "react-router-dom";

function ParticipantLogin() {
  const navigate = useNavigate();
  const [showVisionDetails, setShowVisionDetails] = useState(false);
  const [selectedProblems, setSelectedProblems] = useState([]);
  const [age, setAge] = useState("");
  const [otherProblems, setOtherProblems] = useState("");

  const Impairment = Object.freeze({
    NEARSIGHTED: "NEARSIGHTED",
    FARSIGHTED: "FARSIGHTED",
    ASTIGMATISM: "ASTIGMATISM",
    PRESBYOPIA: "PRESBYOPIA",
    EYE_DISEASE: "EYE_DISEASE",
  });

  const handleSwitchChange = () => {
    setShowVisionDetails(!showVisionDetails);
  };

  const handleCheckboxChange = (e) => {
    const { checked, value } = e.target;
    if (checked) {
      setSelectedProblems([...selectedProblems, value]);
    } else {
      setSelectedProblems(selectedProblems.filter((item) => item !== value));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    request("POST", "/apply", {
      age: age,
      impairmentTypes: selectedProblems,
      otherProblems,
    })
      .then(() => {
        console.log("HAYA FRIEND :)");
        navigate("/home");
      })
      .catch((error) => {
        console.error("Error details:", error);
        console.log("NOT HAYA :(");
      });
  };

  return (
    <div className="row mb-3 p-3">
      <div className="container d-grid" style={{ placeItems: "center" }}>
        <Card className="col-sm-6">
          <Card.Body>
            <Form onSubmit={handleSubmit}>
              <Form.Group className="mb-3" controlId="formGroupAge">
                <Form.Label>Koliko imate godina?</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Vaše godine"
                  value={age}
                  onChange={(e) => setAge(e.target.value)}
                />
              </Form.Group>
              <Form.Group className="mb-3" controlId="formGroupScreen">
                <Form.Check
                  type="switch"
                  id="custom-switch1"
                  label="Imate li problema s čitanjem s zaslona?"
                />
              </Form.Group>
              <Form.Group className="mb-3" controlId="formGroupVision">
                <Form.Check
                  type="switch"
                  id="custom-switch2"
                  label="Imate li generalnih problema s vidom/čitanjem?"
                  onChange={handleSwitchChange}
                />
              </Form.Group>
              {showVisionDetails && (
                <>
                  <Form.Group className="mb-3">
                    <Form.Label>
                      Odaberite probleme s vidom/čitanjem koje imate:
                    </Form.Label>
                    <div key="vision-checkboxes">
                      <Form.Check
                        type="checkbox"
                        id="nearsighted"
                        label="Kratkovidnost"
                        value={Impairment.NEARSIGHTED}
                        onChange={handleCheckboxChange}
                        checked={selectedProblems.includes(
                          Impairment.NEARSIGHTED
                        )}
                      />
                      <Form.Check
                        type="checkbox"
                        id="farsighted"
                        label="Dalekovidnost"
                        value={Impairment.FARSIGHTED}
                        onChange={handleCheckboxChange}
                        checked={selectedProblems.includes(
                          Impairment.FARSIGHTED
                        )}
                      />
                      <Form.Check
                        type="checkbox"
                        id="astigmatism"
                        label="Astigmatizam"
                        value={Impairment.ASTIGMATISM}
                        onChange={handleCheckboxChange}
                        checked={selectedProblems.includes(
                          Impairment.ASTIGMATISM
                        )}
                      />
                      <Form.Check
                        type="checkbox"
                        id="presbyopia"
                        label="Dobna dalekovidnost"
                        value={Impairment.PRESBYOPIA}
                        onChange={handleCheckboxChange}
                        checked={selectedProblems.includes(
                          Impairment.PRESBYOPIA
                        )}
                      />
                      <Form.Check
                        type="checkbox"
                        id="eyedisease"
                        label="Očne bolesti (npr., sive mrene, glaukom)"
                        value={Impairment.EYE_DISEASE}
                        onChange={handleCheckboxChange}
                        checked={selectedProblems.includes(
                          Impairment.EYE_DISEASE
                        )}
                      />
                    </div>
                  </Form.Group>
                  <Form.Group
                    className="mb-3"
                    controlId="formGroupVisionDetails"
                  >
                    <Form.Label>
                      Ako nije ponuđeno, molim Vas navedite:
                    </Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Navedite"
                      value={otherProblems}
                      onChange={(e) => setOtherProblems(e.target.value)}
                    />
                  </Form.Group>
                </>
              )}
              <div className="text-end">
                <Button variant="primary" type="submit">
                  Dalje
                </Button>
              </div>
            </Form>
          </Card.Body>
        </Card>
      </div>
    </div>
  );
}

export default ParticipantLogin;
