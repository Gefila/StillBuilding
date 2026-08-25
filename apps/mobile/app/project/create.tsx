import FormProject from "@/features/project/components/FormProject";
import { View } from "react-native";

export default function CreateProject() {
  return (
    <View className="flex-1">
      <FormProject isEdit={false} />
    </View>
  );
}
