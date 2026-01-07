import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Post('login')
  async login(@Body() body: any) {
    // Frontend'den artık 'email' değil genel bir 'identifier' (kimlik) gelecek
    const user = await this.usersService.login(body.identifier, body.password);
    if (user) {
      return { message: 'Giriş Başarılı', user };
    }
    return { message: 'Hatalı e-posta/telefon veya şifre' };
  }

  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    // Service kısmında yaptığımız güncelleme sayesinde
    // burası artık kullanıcının etkinliklerini de döndürecek.
    return this.usersService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(+id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(+id);
  }
}