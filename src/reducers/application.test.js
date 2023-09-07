import {
  render,
  waitFor,
  waitForElement,
  fireEvent,
  getByText,
  getByPlaceholderText,
  getByAltText,
  getAllByTestId,
  getAllByAltText,
  queryByText,
  queryByAltText
} from "@testing-library/react";
import Application from "components/Application";
import React from "react";
import axios from "__mocks__/axios";

describe("Appointment", () => {
  it("loads data, books an interview, and reduces the spots remaining for the first day by 1", async () => {
    const { container, debug } = render(<Application />);

    //Wait until the text "Archie Cohen" is displayed.
    await waitForElement(() => getByText(container, "Archie Cohen"));

    // Wait for the "Monday" day to be displayed
    await waitForElement(() => getByText(container, "Monday"));

    // Click on the "Add" button to create a new appointment
    const addButtons = getAllByAltText(container, "Add");
    fireEvent.click(addButtons[0]); // Use the first "Add" button

    // Find and fill in the name input field
    const input = getByPlaceholderText(container, "Enter Student Name");
    fireEvent.change(input, { target: { value: "Lydia Miller-Jones" } });

    // Find and select an interviewer (update the alt text as needed)
    fireEvent.click(getByAltText(container, "Sylvia Palmer"));

    // Click on the "Save" button to book the appointment
    fireEvent.click(getByText(container, "Save"));

    // Expect to see the "SAVING" status while the request is being made
    expect(getByText(container, "Saving")).toBeInTheDocument();

    // Wait for the appointment to appear
    await waitForElement(() => getByText(container, "Lydia Miller-Jones"));

    // Ensure the spot count is reduced by 1
    const day = getAllByTestId(container, "day").find((day) =>
      queryByText(day, "Monday")
    );
    expect(queryByText(day, "no spots remaining")).toBeInTheDocument();
  });

  it("loads data, cancels an interview and increases the spots remaining for Monday by 1", async () => {
    // 1. Render the Application.
    const { container, debug } = render (<Application />);

    // 2. Wait until the text "Archie Cohen" is displayed.
    await waitForElement(() => getByText(container, "Archie Cohen"));
    

    // 3. Click the "Delete" button on the booked appointment.
    const appointment = getAllByTestId(container, "appointment").find(
      appointment => queryByText(appointment, "Archie Cohen")
    );
  
    fireEvent.click(queryByAltText(appointment, "Delete"));

    // 4. Check that the confirmation message is shown.
    await waitForElement(() => getByText(container, "Are you sure you would like to delete?"));

    // 5. Click the "Confirm" button on the confirmation.
    const confirmButton = getByText(container, "Confirm");
    fireEvent.click(confirmButton);

    // 6. Check that the element with the text "Deleting" is displayed.
    await waitForElement(() => getByText(container, "Deleting"));

    // 7. Wait until the element with the "Add" button is displayed.
    await waitForElement(() => getAllByAltText(container, "Add"));

    // 8. Check that the DayListItem with the text "Monday" also has the text "2 spots remaining".
    const day = getAllByTestId(container, "day").find(day =>
      queryByText(day, "Monday")
    );
  
    expect(getByText(day, "2 spots remaining")).toBeInTheDocument();
  });

  it("loads data, edits an interview, and keeps the spots remaining for Monday the same", async () => {
    // 1. Render the Application.
    const { container } = render(<Application />);

    // 2. Wait until the text "Archie Cohen" is displayed.
    await waitForElement(() => getByText(container, "Archie Cohen"));

    // 3. Find the appointment with "Archie Cohen" and click on the "Edit" button.
    const appointment = getAllByTestId(container, "appointment").find(
      (appointment) => queryByText(appointment, "Archie Cohen")
    );
    
    fireEvent.click(queryByAltText(appointment, "Edit"));

    // 4. Find and fill in the name input field with a new name.
    const input = getByPlaceholderText(container, "Enter Student Name");
    fireEvent.change(input, { target: { value: "New Student Name" } });

    // 5. Click on the "Save" button to edit the appointment.
    fireEvent.click(getByText(container, "Save"));

    // 6. Expect to see the "SAVING" status while the request is being made.
    expect(getByText(container, "Saving")).toBeInTheDocument();

    // 7. Wait for the edited appointment to appear.
    await waitForElement(() => getByText(container, "New Student Name"));
  });
  
  it("shows the save error when failing to save an appointment", () => {
    axios.put.mockRejectedValueOnce();
  });
});
