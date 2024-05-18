import { ref, computed } from "vue";
import { useNovels } from "@/api/useNovels";
import { type Novel_base_inf } from "@/types";

export function useCrawl() {
  const file = ref<File | null>(null);
  const { uploadNovels, getNovelsSort } = useNovels();
  const novels = ref<Novel_base_inf[]>([]);
  const itemsPerPage = 10; // 每页显示的项目数量
  const currentPage = ref(1); // 当前页码
  function uploadJson(event: Event) {
    const target = event.target as HTMLInputElement;
    if (target.files?.[0]) {
      file.value = target.files[0];
    }
  }

  async function submitJson() {
    if (file.value && file.value.type == 'application/json') {
      const reader = new FileReader();

      reader.onload = async (event) => {
        try {
          const content = event.target?.result;
          const data = JSON.parse(content as string);
          const response = await uploadNovels(data);
          console.log(response);
        } catch (error) {
          console.error("Error reading file or submitting JSON", error);
        }
      };

      reader.readAsText(file.value);
    }
  }

  async function GetViewSort(field: string) {
    const response = await getNovelsSort(field);
    novels.value = response;  // 直接赋值给 novels，确保 novels 和 displayedNovels 具有相同的属性结构
  }

  // 计算当前页应该显示的小说条目
  const displayedNovels = computed(() => {
    const start = (currentPage.value - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    return novels.value.slice(start, end);
  });

  // 切换到上一页
  const prevPage = async () => {
    if (currentPage.value > 1) {
      currentPage.value--;
    }
  };

  // 切换到下一页
  const nextPage = async () => {
    const totalPages = Math.ceil(novels.value.length / itemsPerPage);
    if (currentPage.value < totalPages) {
      currentPage.value++;
    }
  };

  return {
    novels,
    currentPage,
    uploadJson,
    submitJson,
    GetViewSort,
    prevPage,
    nextPage,
    displayedNovels,
    itemsPerPage,
  };
}
