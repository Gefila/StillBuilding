import FormProject from "@/features/project/components/FormProject";
import { useGetProjectById } from "@/features/project/hooks/useProject";
import { useLocalSearchParams } from "expo-router";
import { Text, View } from "react-native";

export default function EditProject() {
  const { id } = useLocalSearchParams();
  const projectQuery = useGetProjectById({
    id: id as string,
    queryConfig: {
      enabled: !!id,
    },
  });

  if (projectQuery.isLoading) {
    return (
      <View className="flex-1 items-center justify-center">
        <Text className="text-gray-500">Loading project details...</Text>
      </View>
    );
  }

  return (
    <View className="flex-1">
      <FormProject isEdit={true} initialData={projectQuery.data} />
    </View>
  );
}
