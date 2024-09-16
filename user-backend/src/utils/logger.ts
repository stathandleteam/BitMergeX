import { format } from 'date-fns'
import {v4 as uuid} from 'uuid'
import fs from 'fs'
import { promises as fsPromises } from 'fs'
import path from 'path'

export const logger = async (message: string, logName: string) => {
	const dateTime = `${format(new Date(), `yyyyMMdd\tHH:mm:ss`)}`
	const logItem = `${dateTime}\t${uuid()}\t${message}\n`;
	console.log(logItem)
	try{
		if (!fs.existsSync(path.join(__dirname, '..', 'logs'))){
			await fsPromises.mkdir(path.join(__dirname, '..', 'logs'))
		}
		await fsPromises.appendFile(path.join(__dirname, '..', 'logs', logName), logItem);
	} catch (err:any){
		console.error(err)
	}
}