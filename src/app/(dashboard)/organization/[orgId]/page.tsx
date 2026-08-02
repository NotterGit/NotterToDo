import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";

export default async function OrganizationIdPage() {
    async function create(formData: FormData) {
        "use server";

        const title = formData.get("title") as string;
        await db.board.create({
            data: {
                title,
            },
        });

        revalidatePath("/organization/[orgId]");
    }

    const boards = await db.board.findMany();

    return (
        <div className="flex flex-col gap-y-4">
            <form action={create} className="flex flex-col gap-y-2">
                <input 
                    id="title" 
                    name="title" 
                    required 
                    placeholder="Enter a board title"
                    className="border-black border p-1"
                />
                <button type="submit" className="bg-blue-500 text-white p-2 rounded">
                    Submit
                </button>
            </form>
            <div className="space-y-2">
                {boards.map((board) => (
                    <div key={board.id}>
                        Board: {board.title}
                    </div>
                ))}
            </div>
        </div>
    );
}