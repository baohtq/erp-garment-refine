import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useSubmitContactRequest } from '../hooks';
import { Loader2, CheckCircle2 } from 'lucide-react';

const contactFormSchema = z.object({
  name: z.string().min(2, { message: 'Tên phải có ít nhất 2 ký tự' }),
  email: z.string().email({ message: 'Email không hợp lệ' }),
  phone: z.string().optional(),
  subject: z.string().optional(),
  message: z.string().min(10, { message: 'Tin nhắn phải có ít nhất 10 ký tự' })
});

type ContactFormValues = z.infer<typeof contactFormSchema>;

interface ContactFormProps {
  className?: string;
}

export const ContactForm = ({ className }: ContactFormProps) => {
  const [submitted, setSubmitted] = useState(false);
  const { mutate: submitContactRequest, isPending, isSuccess, isError } = useSubmitContactRequest();

  const form = useForm<ContactFormValues>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      subject: '',
      message: ''
    }
  });

  const onSubmit = (values: ContactFormValues) => {
    submitContactRequest(values, {
      onSuccess: () => {
        setSubmitted(true);
        form.reset();
      }
    });
  };

  if (submitted && isSuccess) {
    return (
      <div className={`${className} p-6 bg-green-50 border border-green-200 rounded-lg text-center`}>
        <CheckCircle2 className="mx-auto h-12 w-12 text-green-500" />
        <h3 className="mt-4 text-lg font-semibold text-green-800">Cảm ơn bạn đã liên hệ!</h3>
        <p className="mt-2 text-green-600">
          Chúng tôi đã nhận được thông tin liên hệ của bạn và sẽ phản hồi trong thời gian sớm nhất.
        </p>
        <Button
          className="mt-4"
          variant="outline"
          onClick={() => setSubmitted(false)}
        >
          Gửi tin nhắn khác
        </Button>
      </div>
    );
  }

  return (
    <div className={className}>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Họ tên</FormLabel>
                  <FormControl>
                    <Input placeholder="Nguyễn Văn A" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="example@email.com" type="email" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Số điện thoại</FormLabel>
                  <FormControl>
                    <Input placeholder="0912345678" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="subject"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tiêu đề</FormLabel>
                  <FormControl>
                    <Input placeholder="Tiêu đề tin nhắn" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="message"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nội dung tin nhắn</FormLabel>
                <FormControl>
                  <Textarea 
                    placeholder="Nhập nội dung tin nhắn của bạn tại đây..." 
                    className="min-h-[120px]" 
                    {...field} 
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" disabled={isPending} className="w-full">
            {isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Đang gửi...
              </>
            ) : (
              'Gửi tin nhắn'
            )}
          </Button>

          {isError && (
            <p className="text-sm text-red-500 text-center mt-2">
              Có lỗi xảy ra khi gửi tin nhắn. Vui lòng thử lại sau.
            </p>
          )}
        </form>
      </Form>
    </div>
  );
};

export default ContactForm; 