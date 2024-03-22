import { Inject, Injectable } from '@nestjs/common';
import { CreateReservationDto } from './dto/create-reservation.dto';
import { UpdateReservationDto } from './dto/update-reservation.dto';
import { ReservationsRepository } from './reservations.repository';
import { ClientProxy } from '@nestjs/microservices';
import { PAYMENTS_SERVICE } from '@app/common';
import { map } from 'rxjs';

@Injectable()
export class ReservationsService {
  constructor(
    private readonly reservaionRepository: ReservationsRepository,
    @Inject(PAYMENTS_SERVICE) private readonly paymentsService: ClientProxy,
  ) {}

  // TODO PAYMENTS_SERVICE로 create_charge 메시지를 보내고, 응답을 받아서 invoiceId를 저장
  // TODO 현재 유저 타입이 이상하게 잡히는 버그가 있음 ㅠ_ㅠ 귀찮으니까 하지말자
  async create(createReservationDto: CreateReservationDto, user: any) {
    console.log('ReservationsService', user);

    return this.paymentsService
      .send('create_charge', {
        ...createReservationDto.charge,
        email: user.user.email,
      })
      .pipe(
        map((res) => {
          return this.reservaionRepository.create({
            ...createReservationDto,
            invoiceId: res.id,
            timestamp: new Date(),
            userId: user.user._id,
          });
        }),
      );
  }

  findAll() {
    return this.reservaionRepository.find({});
  }

  findOne(_id: string) {
    return this.reservaionRepository.findOne({ _id });
  }

  update(_id: string, updateReservationDto: UpdateReservationDto) {
    return this.reservaionRepository.findOneAndUpdate(
      { _id },
      { $set: updateReservationDto },
    );
  }

  remove(_id: string) {
    return this.reservaionRepository.findOneAndDelete({ _id });
  }
}
