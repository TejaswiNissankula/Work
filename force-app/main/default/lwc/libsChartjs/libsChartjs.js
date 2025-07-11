/* Mega Hack project : referer to this link from more details : https://sf-mini-hacks.herokuapp.com/archives/df23/megahack/ 
Scenario 4 : in https://docs.google.com/document/d/1PHXYxVyRiaWyVWR3TQ9jB7iBEpZNwRnehD4wctVm4qA/edit?tab=t.7itctyuxfdpr*/
import { LightningElement, api } from 'lwc';
import chartjs from '@salesforce/resourceUrl/chartJs';
import { loadScript } from 'lightning/platformResourceLoader';
import getExpenses from '@salesforce/apex/ExpensesController.getExpenses';
import saveFile from '@salesforce/apex/ExpensesController.saveFile';
import {ShowToastEvent} from 'lightning/platformShowToastEvent';
/**
 * When using this component in an LWR site, please import the below custom implementation of 'loadScript' module
 * instead of the one from 'lightning/platformResourceLoader'
 *
 * import { loadScript } from 'c/resourceLoader';
 *
 * This workaround is implemented to get around a limitation of the Lightning Locker library in LWR sites.
 * Read more about it in the "Lightning Locker Limitations" section of the documentation
 * https://developer.salesforce.com/docs/atlas.en-us.exp_cloud_lwr.meta/exp_cloud_lwr/template_limitations.htm
 */

const generateRandomNumber = () => {
    return Math.round(Math.random() * 100);
};

export default class LibsChartjs extends LightningElement {
    error;
    chart;
    chartjsInitialized = false;
    @api startDate;
    @api endDate;
    message;
    msgClass;
    config = {
        type: 'doughnut',
        options: {
            responsive: false,
            plugins: {
                legend: {
                    position: 'right'
                }
            },
            animation: {
                animateScale: true,
                animateRotate: true
            }
        }
    };

    async renderedCallback() {
        if (this.chartjsInitialized) {
            return;
        }
        this.chartjsInitialized = true;

        try {
            await loadScript(this, chartjs);
            const data = {
                datasets: [
                    {
                        data: [],
                        backgroundColor: [],
                        label: 'Dataset 1'
                    }
                ],
                labels: []
            };
            const summarizedResult = await getExpenses({ startDate: this.startDate, endDate: this.endDate });
            summarizedResult?.forEach((item) => {
                data.datasets[0].data.push(item.TotalAmount);
                data.labels.push(item.Expense_Type__c);
                data.datasets[0].backgroundColor.push(this.randomRGB());
            });
            console.log('data-->', data);

            this.config.data = data;
            console.log('this.config-- >', this.config);

            const canvas = document.createElement('canvas');
            this.template.querySelector('div.chart').appendChild(canvas);
            const ctx = canvas.getContext('2d');
            this.chart = new window.Chart(ctx, this.config);
            

        } catch (error) {
            this.error = error;
        }
    }
    handleClick(event){
        this.message = null;
        this.msgClass = null;
        const localbase64Image = this.chart.toBase64Image();
        const sd = new Date(this.startDate);
        const ed = new Date(this.endDate);
        const sd_formatedDate = sd.getFullYear()+'_'+(sd.getMonth()+1)+'_'+sd.getDate();
        const ed_formatedDate =ed.getFullYear()+'_'+(ed.getMonth()+1)+'_'+ed.getDate();
        console.log('base64Image-->',localbase64Image);
        console.log('sd_formatedDate-->',sd_formatedDate);
        console.log('ed_formatedDate-->',ed_formatedDate);
         
            //debugger;
        saveFile({
            base64Image:localbase64Image.split(',')[1],
            title:`Expenses-${sd_formatedDate}-${ed_formatedDate}`
        }).then(()=>{
            //Need to work on css display message and back ground color are not aligned.
            console.log('inside then start')
            this.message = 'Chart Saved as Image in File Successfully !!';
            this.msgClass = 'custom-notify slds-theme_success';
            
        console.log('inside then end')

        })
        .catch((e)=>{
            this.message = 'Chart Failed to save';
            this.msgClass ='custom-notify slds-theme_error';
        })
        
    }
    clearMessage(){
        this.message=null;
        this.msgClass = null;
    }
    randomRGB() {
        const x = Math.floor(Math.random() * 256);
        const y = Math.floor(Math.random() * 256);
        const z = Math.floor(Math.random() * 256);

        return "rgb(" + x + "," + y + "," + z + ")";

    }

}
