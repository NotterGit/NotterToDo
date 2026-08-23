import { images } from "@/config/const/image.const";
import { Card } from "./card";

export function About() {
  return (
    <section className="space-y-4">
      <Card
        name="Просто и удобно"
        description="Мы предоставляем простое, удобное, а главное бесплатное приложение для ведения задач и организации дел без лишней сложности"
        img={images.ICONS.LAMP}
      />

      <Card
        name="Функционально"
        description="Большой функционал, которого с запасом хватит для любых задач: доски, списки, перетаскивание карточек и подробный журнал действий"
        img={images.ICONS.OPTIONS}
      />

      <Card
        name="Работай в команде"
        description="В Notter ToDo присутствует поддержка организаций из Qual ID для совместной командной работы и распределения ролей"
        img={images.ICONS.PEOPLE}
      />

      <Card
        name="Синхронизируй"
        description="Синхронизируя данные в реальном времени, вы можете комфортно и непрерывно работать с любого устройства"
        img={images.ICONS.ECOSYSTEM}
      />
    </section>
  );
}



