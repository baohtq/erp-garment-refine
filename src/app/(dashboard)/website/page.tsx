import { Metadata } from "next";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Overview } from "@/components/dashboard/overview";
import { RecentActivity } from "@/components/dashboard/recent-activity";
import { Analytics } from "@/components/dashboard/analytics";
import { WebsitePreview } from "@/components/dashboard/website-preview";
import { BarChart, Globe, Users, FileText, Image, Mail, Briefcase } from 'lucide-react';

export const metadata: Metadata = {
  title: "Quản lý Website",
  description: "Quản lý thông tin và nội dung website của doanh nghiệp.",
};

export default function WebsiteDashboard() {
  return (
    <div className="flex flex-col gap-4">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Lượt truy cập</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12,521</div>
            <p className="text-xs text-muted-foreground">+18% so với tháng trước</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Số bài viết</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">23</div>
            <p className="text-xs text-muted-foreground">+4 bài viết mới trong tháng</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Yêu cầu liên hệ</CardTitle>
            <Mail className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">8</div>
            <p className="text-xs text-muted-foreground">3 yêu cầu chưa xử lý</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Vị trí tuyển dụng</CardTitle>
            <Briefcase className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">5</div>
            <p className="text-xs text-muted-foreground">2 vị trí mới đăng</p>
          </CardContent>
        </Card>
      </div>
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Tổng quan</TabsTrigger>
          <TabsTrigger value="analytics">Phân tích</TabsTrigger>
          <TabsTrigger value="preview">Xem website</TabsTrigger>
          <TabsTrigger value="activity">Hoạt động gần đây</TabsTrigger>
        </TabsList>
        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            <Card className="col-span-4">
              <CardHeader>
                <CardTitle>Lượt truy cập</CardTitle>
              </CardHeader>
              <CardContent className="pl-2">
                <Overview />
              </CardContent>
            </Card>
            <Card className="col-span-3">
              <CardHeader>
                <CardTitle>Phân tích nội dung</CardTitle>
                <CardDescription>
                  Thống kê lượt xem theo loại nội dung
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center">
                    <div className="w-1/2 flex items-center">
                      <div className="mr-2 h-4 w-4 rounded-full bg-primary"></div>
                      <span className="text-sm">Trang chủ</span>
                    </div>
                    <div className="w-1/2 text-right text-sm">42%</div>
                  </div>
                  <div className="flex items-center">
                    <div className="w-1/2 flex items-center">
                      <div className="mr-2 h-4 w-4 rounded-full bg-blue-500"></div>
                      <span className="text-sm">Sản phẩm</span>
                    </div>
                    <div className="w-1/2 text-right text-sm">28%</div>
                  </div>
                  <div className="flex items-center">
                    <div className="w-1/2 flex items-center">
                      <div className="mr-2 h-4 w-4 rounded-full bg-green-500"></div>
                      <span className="text-sm">Blog</span>
                    </div>
                    <div className="w-1/2 text-right text-sm">18%</div>
                  </div>
                  <div className="flex items-center">
                    <div className="w-1/2 flex items-center">
                      <div className="mr-2 h-4 w-4 rounded-full bg-yellow-500"></div>
                      <span className="text-sm">Giới thiệu</span>
                    </div>
                    <div className="w-1/2 text-right text-sm">8%</div>
                  </div>
                  <div className="flex items-center">
                    <div className="w-1/2 flex items-center">
                      <div className="mr-2 h-4 w-4 rounded-full bg-red-500"></div>
                      <span className="text-sm">Tuyển dụng</span>
                    </div>
                    <div className="w-1/2 text-right text-sm">4%</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Card className="col-span-1">
              <CardHeader>
                <CardTitle>Thống kê yêu cầu liên hệ</CardTitle>
                <CardDescription>
                  Tình trạng xử lý các yêu cầu liên hệ
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center">
                    <div className="w-1/2 flex items-center">
                      <div className="mr-2 h-3 w-3 rounded-full bg-red-500"></div>
                      <span className="text-sm">Chưa xử lý</span>
                    </div>
                    <div className="w-1/2 text-right text-sm">3</div>
                  </div>
                  <div className="flex items-center">
                    <div className="w-1/2 flex items-center">
                      <div className="mr-2 h-3 w-3 rounded-full bg-yellow-500"></div>
                      <span className="text-sm">Đang xử lý</span>
                    </div>
                    <div className="w-1/2 text-right text-sm">2</div>
                  </div>
                  <div className="flex items-center">
                    <div className="w-1/2 flex items-center">
                      <div className="mr-2 h-3 w-3 rounded-full bg-green-500"></div>
                      <span className="text-sm">Đã xử lý</span>
                    </div>
                    <div className="w-1/2 text-right text-sm">3</div>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="col-span-2">
              <CardHeader>
                <CardTitle>Thông tin quản lý</CardTitle>
                <CardDescription>
                  Các mục cần quản lý và cập nhật
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-start space-x-4">
                    <div className="bg-primary/10 p-2 rounded-full">
                      <Globe className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h4 className="text-sm font-medium">Thông tin công ty</h4>
                      <p className="text-xs text-muted-foreground">
                        Cập nhật thông tin liên hệ, giới thiệu công ty
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-4">
                    <div className="bg-primary/10 p-2 rounded-full">
                      <Image className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h4 className="text-sm font-medium">Banner & Hình ảnh</h4>
                      <p className="text-xs text-muted-foreground">
                        Quản lý banner trang chủ và hình ảnh hiển thị
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-4">
                    <div className="bg-primary/10 p-2 rounded-full">
                      <FileText className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h4 className="text-sm font-medium">Bài viết & Blog</h4>
                      <p className="text-xs text-muted-foreground">
                        Thêm và cập nhật nội dung bài viết
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-4">
                    <div className="bg-primary/10 p-2 rounded-full">
                      <BarChart className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h4 className="text-sm font-medium">Phân tích & SEO</h4>
                      <p className="text-xs text-muted-foreground">
                        Tối ưu hiệu suất website và SEO
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        <TabsContent value="analytics" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Phân tích chi tiết</CardTitle>
              <CardDescription>
                Thống kê chi tiết về người dùng và hành vi
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Analytics />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="preview" className="space-y-4">
          <WebsitePreview />
        </TabsContent>
        <TabsContent value="activity" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Hoạt động gần đây</CardTitle>
              <CardDescription>
                Các hoạt động và cập nhật mới nhất trên website
              </CardDescription>
            </CardHeader>
            <CardContent>
              <RecentActivity />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
} 