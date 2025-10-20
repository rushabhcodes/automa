import z from "zod";
import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { zodResolver } from "@hookform/resolvers/zod";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useEffect } from "react";

// Allow moustache placeholders in otherwise valid URLs by sanitizing them before validation.
const templateAwareUrlSchema = z.string().min(1, "Please enter an endpoint URL").refine((value) => {
    try {
        const sanitized = value.replace(/\{\{.*?\}\}/g, "placeholder");
        new URL(sanitized);
        return true;
    } catch {
        return false;
    }
}, {
    message: "Please enter a valid URL"
});

export const formSchema = z.object({
    endpoint: templateAwareUrlSchema,
    method: z.enum(['GET', 'POST', 'PUT', 'PATCH', 'DELETE']),
    body: z.string().optional()
});

interface Props {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSubmit: (value: z.infer<typeof formSchema>) => void;
    defaultEndpoint?: string;
    defaultMethod?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
    defaultBody?: string;
}

export const HttpRequestDialog = ({
    open,
    onOpenChange,
    onSubmit,
    defaultEndpoint = '',
    defaultMethod = 'GET',
    defaultBody = ''
}: Props) => {

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            endpoint: defaultEndpoint,
            method: defaultMethod,
            body: defaultBody
        }
    })

    useEffect(() => {
        if (open) {
            form.reset({
                endpoint: defaultEndpoint,
                method: defaultMethod,
                body: defaultBody
            });
        }
    }, [open, defaultEndpoint, defaultMethod, defaultBody, form]);

    const watchMethod = form.watch("method");

    const showBodyField = ['POST', 'PUT', 'PATCH', 'DELETE'].includes(watchMethod);

    const handleSubmit = (values: z.infer<typeof formSchema>) => {
        onSubmit(values);
        onOpenChange(false);
    }
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>HTTP Request</DialogTitle>
                    <DialogDescription>
                        Configure the HTTP request settings.
                    </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-8 mt-4">
                        <FormField control={form.control} name="method" render={({ field }) => (
                            <FormItem>
                                <FormLabel>Method</FormLabel>
                                <Select onValueChange={field.onChange} value={field.value}>
                                    <FormControl>
                                        <SelectTrigger className="w-full">
                                            <SelectValue placeholder="Select a method" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        <SelectItem value="GET">GET</SelectItem>
                                        <SelectItem value="POST">POST</SelectItem>
                                        <SelectItem value="PUT">PUT</SelectItem>
                                        <SelectItem value="PATCH">PATCH</SelectItem>
                                        <SelectItem value="DELETE">DELETE</SelectItem>
                                    </SelectContent>
                                </Select>
                                <FormDescription>
                                    Select the HTTP method for the request.
                                </FormDescription>
                                <FormMessage />
                            </FormItem>
                        )} />

                        <FormField control={form.control} name="endpoint" render={({ field }) => (
                            <FormItem>
                                <FormLabel>Endpoint URL</FormLabel>
                                <FormControl>
                                    <Input {...field} placeholder="https://api.example.com/users/{{httpResponse.data.id}}" />
                                </FormControl>
                                <FormDescription>
                                    Static URL of use {"{{variable}}"} for simple values or {"{{json variables}}"} to stringify JSON.
                                </FormDescription>
                                <FormMessage />
                            </FormItem>
                        )} />
                        {showBodyField && <FormField control={form.control} name="body" render={({ field }) => (
                            <FormItem>
                                <FormLabel>Request Body</FormLabel>
                                <FormControl>
                                    <Textarea {...field} placeholder={'{\n\t"name": {{httpResponse.data.name}}, \n\t"email": "john.doe@example.com"\n}'} className="h-32 font-mono" />
                                </FormControl>
                                <FormDescription>
                                    JSON body of the HTTP request with variables. You can use {"{{variable}}"} or {"{{json variables}}"} here as well.
                                </FormDescription>
                                <FormMessage />
                            </FormItem>
                        )} />}
                        <DialogFooter>
                            <Button type="submit">Save</Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}