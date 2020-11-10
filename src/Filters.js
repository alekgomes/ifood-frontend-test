import React, { useState } from "react";
import moment from "moment";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import Dropdown from "react-bootstrap/Dropdown";

const Filters = ({ filters, search, setSearch, queryParams, handleClick }) => {
  const filterSelect = (filterObj, variant) => {
    if (!filterObj) return;
    const { id, name, values } = filterObj;

    const clearFilters = () => {
      setQueryParams({
        locale: "en_AU",
        country: "BR",
        timestamp: "2014-10-23T02:00:00.000Z",
        limit: 20,
        offset: 0,
      });
      setSearch("");
    };

    return (
      <div>
        <span>{name}</span>
        <Dropdown>
          <Dropdown.Toggle variant={variant} id={id}>
            {queryParams[id]}
          </Dropdown.Toggle>

          <Dropdown.Menu>
            {values.map(val => {
              return (
                <Dropdown.Item
                  data-value={val.value}
                  onClick={e => {
                    handleClick(e.target.dataset.value, id);
                  }}
                  key={`${val.value}+${val.name}`}
                  defaultValue={val.value === queryParams[id]}
                >
                  {val.name}
                </Dropdown.Item>
              );
            })}
          </Dropdown.Menu>
        </Dropdown>
      </div>
    );
  };

  const filterInput = (filterObj, type = "text") => {
    if (!filterObj) return;
    const { id, name } = filterObj;

    return (
      <label htmlFor={id}>
        <span>{name}</span>
        <input
          type={type}
          name={id}
          id={id}
          value={queryParams[id]}
          min={filterObj.validation.min || ""}
          max={filterObj.validation.max || ""}
          onChange={e => handleClick(e.target.value, id)}
        />
      </label>
    );
  };

  const filterTimestamp = filterObj => {
    if (!filterObj) return;
    const { id, name } = filterObj;
    return (
      <>
        <label htmlFor={id}>
          <span>{name}</span>
          <input
            name={id}
            type="date"
            id={id}
            onChange={e =>
              handleClick(
                moment(
                  e.target.value,
                  filters.timestamp.validation.pattern
                ).toISOString(),
                id
              )
            }
          />
        </label>
      </>
    );
  };

  const displayModal = () => {
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    return (
      <>
        <Button variant="secondary" onClick={handleShow}>
          Mais filtros
        </Button>

        <Modal show={show} onHide={handleClose}>
          <Modal.Body>
            {filterTimestamp(filters.timestamp)}
            {filterInput(filters.limit)}
            {filterInput(filters.offset)}
          </Modal.Body>
        </Modal>
      </>
    );
  };

  return (
    <Form>
      <Form.Group>
        <Form.Row className="justify-content-center">
          {filterSelect(filters.country, "primary")}
          {filterSelect(filters.locale, "info")}
        </Form.Row>
      </Form.Group>

      <div>
        <input
          type="text"
          name="name"
          id="name"
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="search by name..."
          className="mb-2"
        />
      </div>
      <Button variant="primary" onClick={() => clearFilters()}>
        Clear Filters
      </Button>
      {displayModal()}
    </Form>
  );
};

export default Filters;
