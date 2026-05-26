import "jest-styled-components";
import "jest-styled-components/native";

jest.mock("@/__mocks__/firebase");
jest.mock("firebase/app", () => ({}));
jest.mock("firebase/auth", () => ({}));
jest.mock("firebase/firestore", () => ({}));

import Test1 from "@/app/(tabs)/test1";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { render, screen } from "@testing-library/react-native";

describe("<Test1 />", () => {
  //check text output

  beforeEach(() => {
    //before each test
  });

  test("Text renders correctly on Test1", () => {
    render(<Test1 />);
    expect(screen.getAllByText(/Test1*/));
  });

  //check text colour
  test("Text renders check style", async () => {
    // index.tsx Line 61 add: testID = "t1"
    // Looks like: <View testID = "t1" style = {styles.rowContainer}>
    // index.tsx Between Line 101-102 add: color: "#fff",

    //Note: open issue - "ToHaveStyle" and "toHaveStyleRule" doesn't work with props (e.g. <View><View> ...) use "testID" instead (as there is no other way to grab it.)
    const screen = render(<Test1 />);
    const t = await screen.findByTestId("test1");
    expect(t).toHaveStyle({ color: "#fff" });
  });

  //screenshots of a component
  test("CustomText renders correctly", () => {
    const tree = render(
      <IconSymbol
        size={310}
        color="#808080"
        name="chevron.left.forwardslash.chevron.right"
        style={{ backgroundColor: "red" }}
      />,
    ).toJSON();
    expect(tree).toMatchSnapshot(); //matches previously taken snapshot (if no previous takes one)
  });
});
