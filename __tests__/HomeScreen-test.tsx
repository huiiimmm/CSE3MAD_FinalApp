import "jest-styled-components";
import "jest-styled-components/native";

jest.mock("@/__mocks__/firebase");
jest.mock("firebase/app", () => ({}));
jest.mock("firebase/auth", () => ({}));
jest.mock("firebase/firestore", () => ({}));
//this mocks the safe-area-View and Safe-Area-Provider
jest.mock(
  "react-native-safe-area-context",
  () => require("react-native-safe-area-context/jest/mock").default,
);

//without this line the test will always fail as it is a provider function (like firebase and others)
//you could remove the <SafeAreaView \> <SafeAreaProvider \> with Views in Index.tsx

import HomeScreen from "@/app/(tabs)/index";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { render, screen } from "@testing-library/react-native";

describe("<HomeScreen />", () => {
  //check text output

  beforeEach(() => {
    //before each test
  });

  test("Text renders correctly on HomeScreen", () => {
    render(<HomeScreen />);
    expect(screen.getAllByText(/Login*/));
  });

  //check text colour
  test("Text renders check style", async () => {
    // index.tsx Line 61 add: testID = "t1"
    // Looks like: <View testID = "t1" style = {styles.rowContainer}>
    // index.tsx Between Line 101-102 add: color: "#fff",

    //Note: open issue - "ToHaveStyle" and "toHaveStyleRule" doesn't work with props (e.g. <View><View> ...) use "testID" instead (as there is no other way to grab it.)
    const screen = render(<HomeScreen />);
    const t = await screen.findByTestId("index");
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
