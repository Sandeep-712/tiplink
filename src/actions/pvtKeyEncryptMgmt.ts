'use server'

import prisma from '@/db'
import { authOptions } from '@/lib/auth'
import { aesEncrypt } from '@/services/aes-module'
import { splitSecret } from '@/services/keyShardingService'
import { getServerSession } from 'next-auth'

export async function pvtKeyEncryptionManager(privateKey: string) {
  const session = await getServerSession(authOptions)
  const userId = session?.user?.id

  const { aesShareString, awsShareString, gcpShareString }: any =
    await splitSecret(new Uint8Array(Buffer.from(privateKey, 'hex')))

  //AES Share 1 -> share encryption AES module
  const aesEncryptedShare = aesEncrypt(aesShareString)
  //AWS Share 2 ->  share encryption AWS module

  //GCP Share 3 -> share encryption GCP module

  // DB write

  const response = await prisma.user.update({
    where: {
      id: userId,
    },
    data: {
      aesShare: aesEncryptedShare,
    },
  })
  console.log(response)
}
