"use client";

import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { updateUserSchema } from "@/lib/validators";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { UserRole } from "@prisma/client";
import { updateUser } from "@/lib/actions/user.actions";
import { DialogFooter } from "@/components/ui/dialog";

export default function UpdateUserForm({
  user,
}: {
  user: z.infer<typeof updateUserSchema>;
}) {
  const router = useRouter();

  const form = useForm<z.infer<typeof updateUserSchema>>({
    resolver: zodResolver(updateUserSchema),
    defaultValues: user,
  });

  async function onSubmit(values: z.infer<typeof updateUserSchema>) {
    const res = await updateUser(values);

    if (!res.success) {
      toast.error("Failed to update user");
    } else {
      toast.success(res.message);
      router.push("/admin/users");
    }
  }

  return (
    <Form {...form}>
      <form
        className="space-y-6 w-full"
        method="POST"
        onSubmit={form.handleSubmit(onSubmit)}
      >
        {/* Email */}
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem className="w-full">
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder="Enter email" {...field} disabled />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {/* Name */}
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem className="w-full">
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input placeholder="Enter name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {/* Role */}
        <FormField
          control={form.control}
          name="role"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Role</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select a user role" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value={UserRole.user}>User</SelectItem>
                  <SelectItem value={UserRole.admin}>Admin</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <div>
          <DialogFooter>
            <Button
              type="submit"
              size="lg"
              className="mt-4 w-full"
              disabled={form.formState.isSubmitting}
            >
              {form.formState.isSubmitting ? "Submitting..." : `Update`}
            </Button>
          </DialogFooter>
        </div>
      </form>
    </Form>
  );
}
